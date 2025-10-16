'''
Business: API для управления профилем пользователя - адреса доставки и смена пароля
Args: event - dict с httpMethod, body, headers (X-User-Id для авторизации)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными профиля или статусом операции
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters') or {}
    action = query_params.get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_email = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_email:
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
        cur.execute("SELECT id FROM users WHERE email = %s", (user_email,))
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        user_id = user['id']
        
        if action == 'addresses':
            if method == 'GET':
                cur.execute(
                    "SELECT id, address_name, city, address, is_default FROM user_addresses WHERE user_id = %s ORDER BY is_default DESC, created_at DESC",
                    (user_id,)
                )
                addresses = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'addresses': [dict(addr) for addr in addresses]
                    }),
                    'isBase64Encoded': False
                }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                if body_data.get('isDefault'):
                    cur.execute(
                        "UPDATE user_addresses SET is_default = false WHERE user_id = %s",
                        (user_id,)
                    )
                
                cur.execute(
                    "INSERT INTO user_addresses (user_id, address_name, city, address, is_default) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (
                        user_id,
                        body_data.get('addressName'),
                        body_data.get('city'),
                        body_data.get('address'),
                        body_data.get('isDefault', False)
                    )
                )
                address_id = cur.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'addressId': address_id}),
                    'isBase64Encoded': False
                }
            
            elif method == 'DELETE':
                query_params = event.get('queryStringParameters') or {}
                address_id = query_params.get('addressId')
                
                if not address_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'addressId is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "DELETE FROM user_addresses WHERE id = %s AND user_id = %s",
                    (int(address_id), user_id)
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
        
        elif action == 'password':
            if method == 'PUT':
                body_data = json.loads(event.get('body', '{}'))
                new_password = body_data.get('newPassword')
                
                if not new_password:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'newPassword is required'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(new_password)
                
                cur.execute(
                    "UPDATE users SET password_hash = %s WHERE id = %s",
                    (password_hash, user_id)
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
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()