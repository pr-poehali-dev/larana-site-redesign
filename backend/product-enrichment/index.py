import json
import os
from typing import Dict, Any
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
                info = ' '.join(snippets[:3])
                info = re.sub(r'<[^>]+>', '', info)
                info = info[:500]
                return info
            
    except Exception as e:
        print(f'Ошибка поиска: {str(e)}')
    
    return ''

def generate_description(title: str, supplier_article: str, search_info: str) -> str:
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
    
    article_line = f'\nАртикул поставщика: {supplier_article}' if supplier_article else ''
    
    description = f'''🎯 **{title}** — стильное и функциональное решение для вашего интерьера!

✨ **Преимущества:**
{benefits_text}

📦 **Характеристики:**{article_line}

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
    
    description = generate_description(title, supplier_article, search_info)
    
    enriched_data = {
        'description': description,
        'searchInfo': search_info[:200] if search_info else 'Информация не найдена'
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
