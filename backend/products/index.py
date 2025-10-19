import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from decimal import Decimal
from datetime import datetime

def json_serial(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления товарами мебельного каталога
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id, function_name
    Returns: HTTP response dict с товарами или результатом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = None
    cur = None
    
    try:
        print(f"Connecting to database...")
        conn = psycopg2.connect(database_url)
        print(f"Connection established")
        cur = conn.cursor(cursor_factory=RealDictCursor)
        print(f"Cursor created, method: {method}")
        
        if method == 'GET':
            path_params = event.get('pathParams', {})
            product_id = path_params.get('id')
            
            if product_id:
                cur.execute('SELECT * FROM products WHERE id = %s', (product_id,))
                product = cur.fetchone()
                if not product:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Product not found'})
                    }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(product), default=json_serial)
                }
            else:
                cur.execute('SELECT * FROM products ORDER BY created_at DESC')
                products = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(p) for p in products], default=json_serial)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO products (title, slug, description, price, discount_price, category, style, colors, images, items, in_stock, is_new, supplier_article, stock_quantity, variant_group_id, color_variant)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            ''', (
                body_data.get('title'),
                body_data.get('slug'),
                body_data.get('description', ''),
                body_data.get('price'),
                body_data.get('discount_price'),
                body_data.get('category'),
                body_data.get('style', 'Современный'),
                json.dumps(body_data.get('colors', ['Базовый'])),
                json.dumps(body_data.get('images', [])),
                json.dumps(body_data.get('items', [])),
                body_data.get('in_stock', True),
                body_data.get('is_new', False),
                body_data.get('supplierArticle'),
                body_data.get('stockQuantity'),
                body_data.get('variantGroupId'),
                body_data.get('colorVariant')
            ))
            
            product = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(product), default=json_serial)
            }
        
        elif method == 'PUT':
            path_params = event.get('pathParams', {})
            product_id = path_params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product ID required'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                UPDATE products 
                SET title = %s, slug = %s, description = %s, price = %s, discount_price = %s, 
                    category = %s, style = %s, colors = %s, images = %s, items = %s, 
                    in_stock = %s, is_new = %s, supplier_article = %s, stock_quantity = %s, 
                    variant_group_id = %s, color_variant = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            ''', (
                body_data.get('title'),
                body_data.get('slug'),
                body_data.get('description', ''),
                body_data.get('price'),
                body_data.get('discount_price'),
                body_data.get('category'),
                body_data.get('style', 'Современный'),
                json.dumps(body_data.get('colors', ['Базовый'])),
                json.dumps(body_data.get('images', [])),
                json.dumps(body_data.get('items', [])),
                body_data.get('in_stock', True),
                body_data.get('is_new', False),
                body_data.get('supplierArticle'),
                body_data.get('stockQuantity'),
                body_data.get('variantGroupId'),
                body_data.get('colorVariant'),
                product_id
            ))
            
            product = cur.fetchone()
            if not product:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product not found'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(product), default=json_serial)
            }
        
        elif method == 'DELETE':
            path_params = event.get('pathParams', {})
            product_id = path_params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product ID required'})
                }
            
            cur.execute('DELETE FROM products WHERE id = %s RETURNING id', (product_id,))
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product not found'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': product_id})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR: {error_details}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'details': error_details})
        }
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()