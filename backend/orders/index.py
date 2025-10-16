'''
Business: API для управления заказами - создание и получение истории заказов пользователей
Args: event - dict с httpMethod, body, headers (X-User-Id для авторизации)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными заказов или статусом создания
'''

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_email = headers.get('X-User-Id') or headers.get('x-user-id')
    query_params = event.get('queryStringParameters') or {}
    is_admin_request = query_params.get('admin') == 'true'
    
    if not user_email and not is_admin_request:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "INSERT INTO users (email, name, phone, address, city) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address, city = EXCLUDED.city RETURNING id",
                (user_email, body_data.get('name'), body_data.get('phone'), body_data.get('address'), body_data.get('city'))
            )
            user_id = cur.fetchone()['id']
            
            order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{user_id}-{int(datetime.now().timestamp())}"
            
            cur.execute(
                "INSERT INTO orders (user_id, order_number, total_amount, status, delivery_type, payment_type, delivery_address, delivery_city, comment) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    user_id,
                    order_number,
                    body_data.get('totalAmount', 0),
                    'pending',
                    body_data.get('deliveryType'),
                    body_data.get('paymentType'),
                    body_data.get('address'),
                    body_data.get('city'),
                    body_data.get('comment')
                )
            )
            order_id = cur.fetchone()['id']
            
            for item in body_data.get('items', []):
                cur.execute(
                    "INSERT INTO order_items (order_id, product_id, product_title, product_price, quantity) VALUES (%s, %s, %s, %s, %s)",
                    (order_id, item.get('id'), item.get('title'), item.get('price'), item.get('quantity'))
                )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'orderNumber': order_number,
                    'orderId': order_id
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            if is_admin_request:
                cur.execute(
                    "SELECT o.id, o.order_number, o.total_amount, o.status, o.delivery_type, o.payment_type, o.delivery_address, o.delivery_city, o.comment, o.created_at, u.email, u.name, u.phone FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC"
                )
                orders = cur.fetchall()
            else:
                cur.execute(
                    "SELECT id FROM users WHERE email = %s",
                    (user_email,)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'orders': []}),
                        'isBase64Encoded': False
                    }
                
                user_id = user['id']
                
                cur.execute(
                    "SELECT id, order_number, total_amount, status, delivery_type, payment_type, delivery_address, delivery_city, comment, created_at FROM orders WHERE user_id = %s ORDER BY created_at DESC",
                    (user_id,)
                )
                orders = cur.fetchall()
            
            result = []
            for order in orders:
                cur.execute(
                    "SELECT product_id, product_title, product_price, quantity FROM order_items WHERE order_id = %s",
                    (order['id'],)
                )
                items = cur.fetchall()
                
                order_data = {
                    'id': order['id'],
                    'orderNumber': order['order_number'],
                    'totalAmount': order['total_amount'],
                    'status': order['status'],
                    'deliveryType': order['delivery_type'],
                    'paymentType': order['payment_type'],
                    'deliveryAddress': order['delivery_address'],
                    'deliveryCity': order['delivery_city'],
                    'comment': order['comment'],
                    'createdAt': order['created_at'].isoformat() if order['created_at'] else None,
                    'items': [dict(item) for item in items]
                }
                
                if is_admin_request:
                    order_data['userEmail'] = order.get('email')
                    order_data['userName'] = order.get('name')
                    order_data['userPhone'] = order.get('phone')
                
                result.append(order_data)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'orders': result}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            order_id = body_data.get('orderId')
            new_status = body_data.get('status')
            
            if not order_id or not new_status:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing orderId or status'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE orders SET status = %s WHERE id = %s",
                (new_status, order_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()