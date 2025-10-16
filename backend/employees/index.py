'''
Business: API для управления сотрудниками - добавление, получение списка, обновление и удаление
Args: event - dict с httpMethod, body, headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными сотрудников
'''

import json
import os
from typing import Dict, Any, List
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            employee_type = query_params.get('type')
            
            if employee_type:
                cur.execute(
                    "SELECT id, name, phone, email, employee_type, status, created_at FROM employees WHERE employee_type = %s ORDER BY created_at DESC",
                    (employee_type,)
                )
            else:
                cur.execute(
                    "SELECT id, name, phone, email, employee_type, status, created_at FROM employees ORDER BY created_at DESC"
                )
            
            employees = cur.fetchall()
            
            result = []
            for emp in employees:
                result.append({
                    'id': emp['id'],
                    'name': emp['name'],
                    'phone': emp['phone'],
                    'email': emp['email'],
                    'employeeType': emp['employee_type'],
                    'status': emp['status'],
                    'createdAt': emp['created_at'].isoformat() if emp['created_at'] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'employees': result}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "INSERT INTO employees (name, phone, email, employee_type, status) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (
                    body_data.get('name'),
                    body_data.get('phone'),
                    body_data.get('email'),
                    body_data.get('employeeType'),
                    body_data.get('status', 'active')
                )
            )
            employee_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'employeeId': employee_id
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            employee_id = body_data.get('id')
            
            if not employee_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing employee id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE employees SET name = %s, phone = %s, email = %s, employee_type = %s, status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                (
                    body_data.get('name'),
                    body_data.get('phone'),
                    body_data.get('email'),
                    body_data.get('employeeType'),
                    body_data.get('status'),
                    employee_id
                )
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
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            employee_id = query_params.get('id')
            
            if not employee_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing employee id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("DELETE FROM employees WHERE id = %s", (employee_id,))
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
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
