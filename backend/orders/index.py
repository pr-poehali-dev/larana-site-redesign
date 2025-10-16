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
    print(f"[REQUEST] Method: {method}, Path: {event.get('path', 'unknown')}")
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Employee-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_email = headers.get('X-User-Id') or headers.get('x-user-id')
    query_params = event.get('queryStringParameters') or {}
    is_admin_request = query_params.get('admin') == 'true'
    employee_type = query_params.get('employeeType')
    
    if not user_email and not is_admin_request and not employee_type:
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
            print(f"[POST] Creating new order")
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
                    'new',
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
            print(f"[SUCCESS] Order created: {order_number} (ID: {order_id})")
            
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
            print(f"[GET] Fetching orders - admin: {is_admin_request}, employeeType: {employee_type}")
            if is_admin_request:
                cur.execute(
                    "SELECT o.id, o.order_number, o.total_amount, o.status, o.delivery_type, o.payment_type, o.delivery_address, o.delivery_city, o.comment, o.created_at, u.email, u.name, u.phone FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC"
                )
                orders = cur.fetchall()
            elif employee_type:
                # Поддержка нескольких типов через запятую
                employee_types_list = employee_type.split(',')
                
                status_filters = []
                for etype in employee_types_list:
                    etype = etype.strip()
                    status_map = {
                        'new': 'new',
                        'order_processing': 'in_processing',
                        'delivery': 'in_delivery',
                        'assembly': 'delivered'
                    }
                    if etype in status_map:
                        status_filters.append(status_map[etype])
                
                if status_filters:
                    placeholders = ','.join(['%s'] * len(status_filters))
                    query = f"SELECT o.id, o.order_number, o.total_amount, o.status, o.delivery_type, o.payment_type, o.delivery_address, o.delivery_city, o.comment, o.created_at, u.email, u.name, u.phone FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status IN ({placeholders}) ORDER BY o.created_at DESC"
                    cur.execute(query, tuple(status_filters))
                    orders = cur.fetchall()
                else:
                    orders = []
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
                
                if is_admin_request or employee_type:
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
            try:
                body_data = json.loads(event.get('body', '{}'))
                order_id = body_data.get('orderId')
                new_status = body_data.get('status')
                
                print(f"[PUT REQUEST] Order ID: {order_id}, New Status: {new_status}")
                
                if not order_id or not new_status:
                    print(f"[ERROR] Missing required fields - orderId: {order_id}, status: {new_status}")
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Missing orderId or status'}),
                        'isBase64Encoded': False
                    }
                
                # Валидация статуса
                valid_statuses = ['pending', 'in_processing', 'in_delivery', 'delivered', 'cancelled']
                if new_status not in valid_statuses:
                    print(f"[ERROR] Invalid status: {new_status}. Valid statuses: {valid_statuses}")
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}),
                        'isBase64Encoded': False
                    }
                
                # Проверка существования заказа
                cur.execute("SELECT id, status FROM orders WHERE id = %s", (order_id,))
                existing_order = cur.fetchone()
                
                if not existing_order:
                    print(f"[ERROR] Order not found: {order_id}")
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Order not found'}),
                        'isBase64Encoded': False
                    }
                
                print(f"[INFO] Updating order {order_id} from status '{existing_order['status']}' to '{new_status}'")
                
                cur.execute(
                    "UPDATE orders SET status = %s WHERE id = %s",
                    (new_status, order_id)
                )
                
                if cur.rowcount == 0:
                    print(f"[ERROR] Failed to update order {order_id} - no rows affected")
                    conn.rollback()
                    return {
                        'statusCode': 500,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Failed to update order'}),
                        'isBase64Encoded': False
                    }
                
                conn.commit()
                print(f"[SUCCESS] Order {order_id} status updated to '{new_status}'")
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'orderId': order_id,
                        'newStatus': new_status
                    }),
                    'isBase64Encoded': False
                }
            
            except json.JSONDecodeError as e:
                print(f"[ERROR] Invalid JSON in request body: {str(e)}")
                conn.rollback()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Invalid JSON format'}),
                    'isBase64Encoded': False
                }
            
            except psycopg2.Error as e:
                print(f"[ERROR] Database error: {str(e)}")
                conn.rollback()
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Database error occurred'}),
                    'isBase64Encoded': False
                }
            
            except Exception as e:
                print(f"[ERROR] Unexpected error in PUT request: {str(e)}")
                conn.rollback()
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Internal server error'}),
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
    
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON decode error: {str(e)}")
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON format'}),
            'isBase64Encoded': False
        }
    
    except psycopg2.Error as e:
        print(f"[ERROR] Database error: {str(e)}")
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database error occurred'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f"[ERROR] Unexpected error: {str(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Internal server error'}),
            'isBase64Encoded': False
        }
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()