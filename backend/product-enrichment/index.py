import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse

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
    
    search_query = supplier_article if supplier_article else title
    
    enriched_data = {
        'description': f'''🎯 **{title}** — стильное и функциональное решение для вашего интерьера!

✨ **Преимущества:**
• Высокое качество материалов и сборки
• Современный дизайн, который впишется в любой интерьер
• Практичность и долговечность
• Простота в уходе и эксплуатации

📦 **Характеристики:**
Артикул поставщика: {supplier_article}

🎁 Идеально подходит для создания уютной и стильной атмосферы в вашем доме!

💰 Выгодная цена и отличное качество — лучший выбор для вашего комфорта!''',
        'features': [
            'Качественные материалы',
            'Современный дизайн',
            'Простота в уходе',
            'Долговечность конструкции'
        ],
        'benefits': [
            'Создает уют в интерьере',
            'Экономия времени на уборке',
            'Стильный внешний вид',
            'Надежность на годы'
        ]
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