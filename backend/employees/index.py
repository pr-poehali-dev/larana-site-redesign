'''
Business: API для управления сотрудниками - добавление, получение списка, обновление и удаление
Args: event - dict с httpMethod, body, headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными сотрудников
'''

import json
import os
import hashlib
import secrets
import string
from typing import Dict, Any, List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def generate_password(length: int = 12) -> str:
    """Генерирует случайный пароль"""
    alphabet = string.ascii_letters + string.digits + '!@#$%'
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def hash_password(password: str) -> str:
    """Хэширует пароль с использованием SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_login(name: str, existing_logins: list) -> str:
    """Генерирует логин на основе имени"""
    # Транслитерация имени
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    
    name_lower = name.lower()
    login_base = ''
    for char in name_lower:
        if char in translit_map:
            login_base += translit_map[char]
        elif char.isalnum():
            login_base += char
    
    # Берем первую часть имени (до пробела)
    login_base = login_base.split()[0] if login_base.split() else login_base
    login_base = login_base[:20]  # Ограничение длины
    
    # Проверяем уникальность
    login = login_base
    counter = 1
    while login in existing_logins:
        login = f"{login_base}{counter}"
        counter += 1
    
    return login

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
                    "SELECT id, name, phone, email, employee_type, employee_types, status, login, password_hash, created_at FROM employees ORDER BY created_at DESC"
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
                    'employeeTypes': emp['employee_types'] if emp['employee_types'] else [],
                    'status': emp['status'],
                    'login': emp.get('login'),
                    'hasPassword': bool(emp.get('password_hash')),
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
            employee_types = body_data.get('employeeTypes', [])
            
            # Получаем все существующие логины
            cur.execute("SELECT login FROM employees WHERE login IS NOT NULL")
            existing_logins = [row['login'] for row in cur.fetchall()]
            
            # Генерируем логин и пароль
            login = body_data.get('login')
            if not login:
                login = generate_login(body_data.get('name'), existing_logins)
            
            password = body_data.get('password')
            generated_password = None
            password_hash = None
            
            if password:
                password_hash = hash_password(password)
            elif body_data.get('generatePassword'):
                generated_password = generate_password()
                password_hash = hash_password(generated_password)
            
            cur.execute(
                "INSERT INTO employees (name, phone, email, employee_type, employee_types, status, login, password_hash) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (
                    body_data.get('name'),
                    body_data.get('phone'),
                    body_data.get('email'),
                    body_data.get('employeeType'),
                    employee_types,
                    body_data.get('status', 'active'),
                    login,
                    password_hash
                )
            )
            employee_id = cur.fetchone()['id']
            conn.commit()
            
            response_data = {
                'success': True,
                'employeeId': employee_id,
                'login': login
            }
            
            if generated_password:
                response_data['generatedPassword'] = generated_password
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(response_data),
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
            
            employee_types = body_data.get('employeeTypes', [])
            
            # Проверка на сброс пароля или установку нового
            query_params = event.get('queryStringParameters') or {}
            action = query_params.get('action')
            
            response_data = {'success': True}
            
            if action == 'reset_password':
                # Генерация нового пароля
                new_password = generate_password()
                password_hash = hash_password(new_password)
                
                cur.execute(
                    "UPDATE employees SET password_hash = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (password_hash, employee_id)
                )
                conn.commit()
                
                response_data['newPassword'] = new_password
                
            elif action == 'set_password':
                # Установка конкретного пароля
                new_password = body_data.get('password')
                if new_password:
                    password_hash = hash_password(new_password)
                    cur.execute(
                        "UPDATE employees SET password_hash = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                        (password_hash, employee_id)
                    )
                    conn.commit()
                else:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Password required'}),
                        'isBase64Encoded': False
                    }
            
            elif action == 'update_login':
                # Обновление логина
                new_login = body_data.get('login')
                if new_login:
                    cur.execute(
                        "UPDATE employees SET login = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                        (new_login, employee_id)
                    )
                    conn.commit()
                    response_data['login'] = new_login
            
            else:
                # Обычное обновление данных
                cur.execute(
                    "UPDATE employees SET name = %s, phone = %s, email = %s, employee_type = %s, employee_types = %s, status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (
                        body_data.get('name'),
                        body_data.get('phone'),
                        body_data.get('email'),
                        body_data.get('employeeType'),
                        employee_types,
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
                'body': json.dumps(response_data),
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