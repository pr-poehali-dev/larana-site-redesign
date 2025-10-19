"""
Business: API для управления наборами товаров с проверкой остатков
Args: event с httpMethod, body, queryStringParameters
      context с атрибутами request_id, function_name
Returns: HTTP response с данными наборов
"""
import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создает подключение к БД"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def check_bundle_availability(conn, supplier_articles: List[str]) -> bool:
    """Проверяет доступность всех товаров в наборе"""
    with conn.cursor() as cur:
        placeholders = ','.join(f"'{article}'" for article in supplier_articles)
        cur.execute(f"""
            SELECT supplier_article, stock_quantity 
            FROM products 
            WHERE supplier_article IN ({placeholders})
        """)
        products = cur.fetchall()
        
        if len(products) < len(supplier_articles):
            return False
        
        for product in products:
            if product['stock_quantity'] <= 0:
                return False
        
        return True

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            bundle_id = params.get('id')
            
            with conn.cursor() as cur:
                if bundle_id:
                    cur.execute("""
                        SELECT pb.*, 
                               json_agg(
                                   json_build_object(
                                       'id', bi.id,
                                       'supplier_article', bi.supplier_article,
                                       'product_name', bi.product_name,
                                       'quantity', bi.quantity
                                   )
                               ) as items
                        FROM product_bundles pb
                        LEFT JOIN bundle_items bi ON pb.id = bi.bundle_id
                        WHERE pb.id = %s
                        GROUP BY pb.id
                    """, (bundle_id,))
                    bundle = cur.fetchone()
                    
                    if bundle:
                        articles = [item['supplier_article'] for item in bundle['items']]
                        bundle['in_stock'] = check_bundle_availability(conn, articles)
                        result = dict(bundle)
                    else:
                        result = {'error': 'Bundle not found'}
                else:
                    cur.execute("""
                        SELECT pb.id, pb.name, pb.type, pb.color, pb.image_url, 
                               pb.price, pb.description, pb.created_at,
                               json_agg(
                                   json_build_object(
                                       'supplier_article', bi.supplier_article,
                                       'product_name', bi.product_name,
                                       'quantity', bi.quantity
                                   )
                               ) as items
                        FROM product_bundles pb
                        LEFT JOIN bundle_items bi ON pb.id = bi.bundle_id
                        GROUP BY pb.id
                        ORDER BY pb.created_at DESC
                    """)
                    bundles = cur.fetchall()
                    
                    result = []
                    for bundle in bundles:
                        bundle_dict = dict(bundle)
                        articles = [item['supplier_article'] for item in bundle_dict['items']]
                        bundle_dict['in_stock'] = check_bundle_availability(conn, articles)
                        result.append(bundle_dict)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO product_bundles (name, type, color, image_url, price, description)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    body_data['name'],
                    body_data['type'],
                    body_data.get('color'),
                    body_data.get('image_url'),
                    body_data['price'],
                    body_data.get('description')
                ))
                bundle_id = cur.fetchone()['id']
                
                for item in body_data.get('items', []):
                    cur.execute("""
                        INSERT INTO bundle_items (bundle_id, supplier_article, product_name, quantity)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        bundle_id,
                        item['supplier_article'],
                        item['product_name'],
                        item.get('quantity', 1)
                    ))
                
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': bundle_id, 'message': 'Bundle created successfully'})
            }
        
        elif method == 'PUT':
            params = event.get('queryStringParameters', {})
            bundle_id = params.get('id')
            body_data = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE product_bundles 
                    SET name = %s, type = %s, color = %s, image_url = %s, 
                        price = %s, description = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (
                    body_data['name'],
                    body_data['type'],
                    body_data.get('color'),
                    body_data.get('image_url'),
                    body_data['price'],
                    body_data.get('description'),
                    bundle_id
                ))
                
                cur.execute("DELETE FROM bundle_items WHERE bundle_id = %s", (bundle_id,))
                
                for item in body_data.get('items', []):
                    cur.execute("""
                        INSERT INTO bundle_items (bundle_id, supplier_article, product_name, quantity)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        bundle_id,
                        item['supplier_article'],
                        item['product_name'],
                        item.get('quantity', 1)
                    ))
                
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Bundle updated successfully'})
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            bundle_id = params.get('id')
            
            with conn.cursor() as cur:
                cur.execute("DELETE FROM bundle_items WHERE bundle_id = %s", (bundle_id,))
                cur.execute("DELETE FROM product_bundles WHERE id = %s", (bundle_id,))
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Bundle deleted successfully'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()
