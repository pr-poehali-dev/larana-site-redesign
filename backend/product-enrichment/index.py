import json
import os
from typing import Dict, Any, List
import urllib.request
import urllib.parse
import re

def search_product_info(query: str) -> str:
    '''
    Поиск информации о товаре через Яндекс и Google
    '''
    try:
        encoded_query = urllib.parse.quote(query)
        
        yandex_url = f'https://yandex.ru/search/?text={encoded_query}+характеристики+описание'
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        req = urllib.request.Request(yandex_url, headers=headers)
        
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            snippets = re.findall(r'<div class="OrganicTextContentSpan"[^>]*>(.*?)</div>', html, re.DOTALL)
            
            if snippets:
                info = ' '.join(snippets[:5])
                info = re.sub(r'<[^>]+>', '', info)
                return info
            
    except Exception as e:
        print(f'Ошибка поиска: {str(e)}')
    
    return ''

def extract_dimensions(text: str) -> List[str]:
    '''
    Извлечение размеров из текста
    '''
    dimensions = []
    
    patterns = [
        r'(\d+)\s*(?:x|х|×)\s*(\d+)\s*(?:x|х|×)\s*(\d+)\s*(?:см|cm)',
        r'(\d+)\s*(?:x|х|×)\s*(\d+)\s*(?:см|cm)',
        r'ширина\s*[:\-]?\s*(\d+)\s*(?:см|cm)',
        r'глубина\s*[:\-]?\s*(\d+)\s*(?:см|cm)',
        r'высота\s*[:\-]?\s*(\d+)\s*(?:см|cm)',
        r'размер\s*[:\-]?\s*(\d+)\s*(?:см|cm)',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text.lower())
        for match in matches:
            if isinstance(match, tuple):
                dim = ' x '.join([str(m) for m in match if m]) + ' см'
                if dim not in dimensions:
                    dimensions.append(dim)
            else:
                dim = f'{match} см'
                if dim not in dimensions:
                    dimensions.append(dim)
    
    return dimensions[:3]

def extract_materials(text: str) -> List[str]:
    '''
    Извлечение материалов из текста
    '''
    materials_keywords = {
        'ЛДСП': ['лдсп', 'ламинированная'],
        'МДФ': ['мдф'],
        'Массив дерева': ['массив', 'дерев'],
        'Металл': ['металл'],
        'Стекло': ['стекло', 'стеклянн'],
        'Пластик': ['пластик'],
        'Ткань': ['ткань', 'текстиль'],
        'Кожа': ['кожа', 'кожаный'],
        'Экокожа': ['экокожа'],
    }
    
    found_materials = []
    text_lower = text.lower()
    
    for material, keywords in materials_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            found_materials.append(material)
    
    return found_materials[:3]

def extract_colors(text: str) -> List[str]:
    '''
    Извлечение цветов из текста
    '''
    colors_keywords = {
        'Белый': ['белый', 'белая', 'белое'],
        'Черный': ['черный', 'черная', 'черное'],
        'Серый': ['серый', 'серая', 'серое'],
        'Венге': ['венге'],
        'Дуб': ['дуб'],
        'Орех': ['орех'],
        'Бежевый': ['беж'],
        'Коричневый': ['коричнев'],
        'Синий': ['синий', 'синяя'],
        'Зеленый': ['зелен'],
        'Красный': ['красн'],
        'Желтый': ['желт'],
    }
    
    found_colors = []
    text_lower = text.lower()
    
    for color, keywords in colors_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            found_colors.append(color)
    
    return found_colors[:4]

def generate_description(title: str, supplier_article: str, search_info: str, dimensions: List[str], materials: List[str]) -> str:
    '''
    Генерация продающего описания на основе найденной информации
    '''
    
    base_benefits = [
        'Высокое качество материалов и сборки',
        'Современный дизайн, который впишется в любой интерьер',
        'Практичность и долговечность',
        'Простота в уходе и эксплуатации'
    ]
    
    if search_info:
        words = search_info.lower()
        
        if any(word in words for word in ['экологичн', 'эко', 'натуральн']):
            base_benefits.append('Экологически чистые материалы')
        if any(word in words for word in ['прочн', 'надежн', 'долговечн']):
            base_benefits.append('Повышенная прочность и надежность')
        if any(word in words for word in ['стиль', 'дизайн', 'элегант']):
            base_benefits.append('Элегантный и стильный внешний вид')
        if any(word in words for word in ['функционал', 'удобн', 'практичн']):
            base_benefits.append('Продуманная функциональность')
    
    benefits_text = '\n'.join([f'• {benefit}' for benefit in base_benefits[:6]])
    
    characteristics = []
    if materials:
        characteristics.append(f'Материал: {", ".join(materials)}')
    if dimensions:
        characteristics.append(f'Размеры: {", ".join(dimensions)}')
    
    characteristics_text = '\n'.join(characteristics) if characteristics else 'Уточняйте у менеджера'
    
    description = f'''🎯 **{title}** — стильное и функциональное решение для вашего интерьера!

✨ **Преимущества:**
{benefits_text}

📦 **Характеристики:**
{characteristics_text}

🎁 Идеально подходит для создания уютной и стильной атмосферы в вашем доме!

💰 Выгодная цена и отличное качество — лучший выбор для вашего комфорта!'''
    
    return description

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Поиск информации о товаре по артикулу для автозаполнения карточки
    Args: event - dict с httpMethod, body (supplierArticle, title)
          context - object с атрибутами request_id, function_name
    Returns: HTTP response с описанием и характеристиками товара
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str == '':
        body_str = '{}'
    
    body_data = json.loads(body_str)
    supplier_article = body_data.get('supplierArticle', '')
    title = body_data.get('title', '')
    
    if not supplier_article and not title:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Необходим артикул или название товара'}),
            'isBase64Encoded': False
        }
    
    search_query = f'{supplier_article} {title}' if supplier_article else title
    
    search_info = search_product_info(search_query)
    
    dimensions = extract_dimensions(search_info)
    materials = extract_materials(search_info)
    colors = extract_colors(search_info)
    
    description = generate_description(title, supplier_article, search_info, dimensions, materials)
    
    enriched_data = {
        'description': description,
        'dimensions': dimensions,
        'materials': materials,
        'colors': colors,
        'items': dimensions if dimensions else [],
        'searchInfo': search_info[:300] if search_info else 'Информация не найдена'
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(enriched_data, ensure_ascii=False),
        'isBase64Encoded': False
    }