'''
Business: Массовый импорт товаров из JSON в базу данных
Args: event с POST запросом и JSON массивом товаров в body
Returns: Количество импортированных товаров
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import execute_batch

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Only POST allowed'})
        }
    
    headers = event.get('headers', {})
    admin_key = headers.get('X-Admin-Key') or headers.get('x-admin-key')
    
    if admin_key != 'larana-admin-2024':
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Forbidden - admin key required'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    products = body_data.get('products', [])
    
    if not products or not isinstance(products, list):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Products array required'})
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor()
    
    # Очищаем таблицу перед импортом (опционально)
    clear_before = body_data.get('clearBefore', False)
    if clear_before:
        cursor.execute('DELETE FROM products')
        cursor.execute('ALTER SEQUENCE products_id_seq RESTART WITH 1')
        conn.commit()
    
    # Подготавливаем данные для batch insert
    insert_data = []
    slug_counter = {}
    
    for idx, p in enumerate(products):
        # Извлекаем цену числом из строки типа "38900 ₽"
        price_str = str(p.get('price', '0'))
        price_num = float(''.join(filter(str.isdigit, price_str)) or '0')
        
        # Генерируем уникальный slug из названия
        title = p.get('title', '')
        base_slug = title.lower().replace(' ', '-').replace('"', '').replace("'", '').replace('(', '').replace(')', '')
        base_slug = ''.join(c for c in base_slug if c.isalnum() or c == '-')[:50]
        
        # Добавляем счётчик для уникальности
        if base_slug in slug_counter:
            slug_counter[base_slug] += 1
            slug = f"{base_slug}-{slug_counter[base_slug]}"
        else:
            slug_counter[base_slug] = 0
            slug = base_slug
        
        # Первая картинка из массива или основная
        images_list = p.get('images', [])
        if not images_list:
            main_image = p.get('image', '')
            if main_image:
                images_list = [main_image]
        
        insert_data.append((
            title,
            slug,
            p.get('description', ''),
            price_num,
            None,  # discount_price
            p.get('category', ''),
            p.get('style', 'Современный'),
            json.dumps(p.get('colors', [])),
            json.dumps(images_list),
            json.dumps(p.get('items', [])),
            p.get('inStock', True),
            False,  # is_new
            p.get('supplierArticle'),  # supplier_article
            p.get('stockQuantity'),  # stock_quantity
            p.get('variantGroupId'),  # variant_group_id
            p.get('colorVariant')  # color_variant
        ))
    
    # Массовая вставка (вставляем без ID, база сама сгенерирует)
    execute_batch(cursor, '''
        INSERT INTO products (
            title, slug, description, price, discount_price,
            category, style, colors, images, items, in_stock, is_new,
            supplier_article, stock_quantity, variant_group_id, color_variant
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s::jsonb, %s, %s, %s, %s, %s, %s)
    ''', insert_data)
    
    conn.commit()
    imported_count = len(insert_data)
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'imported': imported_count,
            'message': f'Successfully imported {imported_count} products'
        })
    }