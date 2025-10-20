import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List
from decimal import Decimal
from datetime import datetime
import re
from collections import defaultdict

def json_serial(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def extract_base_name(title: str) -> str:
    """
    Извлекает базовое название товара без цвета, размера и артикула
    """
    # Удаляем артикулы в скобках и коды типа ВШ06-600, КМ-800, ОБ-600
    title = re.sub(r'\([^)]*\)', '', title)
    title = re.sub(r'\b[А-Я]{2,}\d{2,}-\d{3,}\b', '', title)
    title = re.sub(r'\b\d{3,}х\d{3,}\b', '', title)  # размеры типа 1400х2000
    
    # Удаляем цвета (русские и английские)
    colors = [
        'белый', 'черный', 'серый', 'синий', 'красный', 'зеленый', 'желтый',
        'коричневый', 'бежевый', 'розовый', 'фиолетовый', 'оранжевый',
        'венге', 'дуб', 'орех', 'вишня', 'ясень', 'сонома',
        'white', 'black', 'gray', 'grey', 'blue', 'red', 'green', 'yellow',
        'brown', 'beige', 'pink', 'purple', 'orange'
    ]
    
    for color in colors:
        title = re.sub(r'\b' + color + r'\b', '', title, flags=re.IGNORECASE)
    
    # Удаляем размеры в скобках типа (1400), (1600)
    title = re.sub(r'\(\d{3,}\)', '', title)
    
    # Удаляем лишние пробелы
    title = ' '.join(title.split())
    
    return title.strip()

def extract_color_variant(title: str) -> str:
    """
    Извлекает цвет/размер из названия товара
    """
    # Ищем размеры в скобках
    size_match = re.search(r'\((\d{3,})\)', title)
    if size_match:
        return size_match.group(1)
    
    # Ищем цвета
    colors = {
        'белый': 'white',
        'черный': 'black',
        'серый': 'grey',
        'синий': 'blue',
        'красный': 'red',
        'зеленый': 'green',
        'коричневый': 'brown',
        'бежевый': 'beige',
        'венге': 'wenge',
        'дуб': 'oak',
        'орех': 'walnut',
        'сонома': 'sonoma'
    }
    
    title_lower = title.lower()
    for ru_color, en_color in colors.items():
        if ru_color in title_lower:
            return en_color
    
    # Ищем артикулы как вариант
    article_match = re.search(r'([А-Я]{2,}\d{2,}-\d{3,})', title)
    if article_match:
        return article_match.group(1).lower()
    
    return 'default'

def generate_variant_group_id(base_name: str, products: List[Dict]) -> str:
    """
    Генерирует variant_group_id в формате kebab-case
    """
    # Берем первые слова базового названия
    words = base_name.lower().split()[:3]
    
    # Транслитерация
    translit_map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    
    result = []
    for word in words:
        transliterated = ''
        for char in word:
            if char in translit_map:
                transliterated += translit_map[char]
            elif char.isalnum():
                transliterated += char
        if transliterated:
            result.append(transliterated)
    
    # Если есть общий артикул, добавляем его
    if len(products) > 0:
        first_title = products[0]['title']
        article_match = re.search(r'([А-Я]{2,}\d{2,})', first_title)
        if article_match and len(result) > 0:
            article = article_match.group(1).lower()
            if article not in '-'.join(result):
                result.append(article)
    
    return '-'.join(result)[:50]  # ограничиваем длину

def analyze_variants(products: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Анализирует товары и группирует их по вариантам
    """
    # Группируем по базовому названию
    base_groups = defaultdict(list)
    
    for product in products:
        base_name = extract_base_name(product['title'])
        if base_name:  # Игнорируем пустые названия
            base_groups[base_name].append(product)
    
    # Фильтруем группы - оставляем только те, где больше 1 товара
    variant_groups = {}
    
    for base_name, group_products in base_groups.items():
        if len(group_products) > 1:
            # Проверяем, что товары действительно похожи (есть в наличии или явно варианты)
            has_stock = any(p.get('stock_quantity', 0) > 0 for p in group_products)
            
            # Проверяем на явные варианты (разные цвета/размеры)
            variants_detected = False
            if len(group_products) >= 2:
                colors_found = set()
                sizes_found = set()
                
                for p in group_products:
                    title = p['title'].lower()
                    # Ищем цвета
                    if any(color in title for color in ['белый', 'черный', 'серый', 'синий', 'коричневый', 'венге']):
                        colors_found.add(True)
                    # Ищем размеры
                    if re.search(r'\(\d{3,}\)', p['title']):
                        sizes_found.add(True)
                
                variants_detected = len(colors_found) > 0 or len(sizes_found) > 0
            
            if has_stock or variants_detected:
                group_id = generate_variant_group_id(base_name, group_products)
                variant_groups[group_id] = {
                    'base_name': base_name,
                    'products': []
                }
                
                for product in group_products:
                    color_variant = extract_color_variant(product['title'])
                    variant_groups[group_id]['products'].append({
                        'id': product['id'],
                        'title': product['title'],
                        'color_variant': color_variant,
                        'stock_quantity': product.get('stock_quantity', 0),
                        'category': product.get('category', ''),
                        'supplier_article': product.get('supplier_article', '')
                    })
    
    return variant_groups

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Анализ товаров для группировки вариантов
    Args: event - dict с httpMethod
          context - объект с request_id, function_name
    Returns: HTTP response dict с группами вариантов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Выполняем запрос
        cur.execute('''
            SELECT id, title, supplier_article, category, color_variant, stock_quantity
            FROM products
            WHERE variant_group_id IS NULL OR variant_group_id = ''
            ORDER BY title
        ''')
        
        products = cur.fetchall()
        products_list = [dict(p) for p in products]
        
        # Анализируем варианты
        variant_groups = analyze_variants(products_list)
        
        # Формируем результат
        result = {
            'total_products': len(products_list),
            'groups_found': len(variant_groups),
            'groups': variant_groups
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result, default=json_serial, ensure_ascii=False)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
