'''
Business: ИИ-консультант для помощи покупателям в выборе мебели
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами: request_id, function_name
Returns: HTTP response dict с ответом от ИИ-ассистента
'''
import json
import os
import requests
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    messages: List[Dict[str, str]] = body_data.get('messages', [])
    products: List[Dict[str, Any]] = body_data.get('products', [])
    
    if not messages:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Messages required'})
        }
    
    api_key = os.environ.get('OPENROUTER_API_KEY') or os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    products_info = ""
    if products:
        products_info = "\n\nТОВАРЫ В КАТАЛОГЕ:\n"
        for p in products[:20]:
            products_info += f"- {p.get('title', 'N/A')} ({p.get('category', 'N/A')}) - {p.get('price', 'N/A')}"
            if p.get('inStock') == False:
                products_info += " [НЕТ В НАЛИЧИИ]"
            products_info += "\n"
    
    system_prompt = f"""Ты - профессиональный консультант мебельного магазина LARANA в Екатеринбурге.

Твоя задача:
- Помогать клиентам выбрать идеальную мебель для их дома
- Рекомендовать конкретные товары из каталога, если клиент интересуется категорией
- Задавать уточняющие вопросы о размерах помещения, стиле, бюджете
- Рассказывать о преимуществах: бесплатная доставка, сборка, рассрочка 0%
- Мотивировать к покупке, подчеркивая качество и выгодные условия
- Создавать ощущение срочности: "Товар популярный, может закончиться"
- Предлагать посмотреть товары в каталоге на сайте
- Быть дружелюбным и профессиональным

Категории товаров:
- Кухни (готовые и на заказ)
- Спальни (кровати, тумбы, комоды)
- Гостиные (стенки, тумбы под ТВ)
- Шкафы-купе (встроенные и корпусные)
- Прихожие
- Детские комнаты

Преимущества LARANA:
✅ Бесплатная доставка и сборка по Екатеринбургу
✅ Рассрочка 0% до 12 месяцев без переплат
✅ Изготовление по индивидуальным размерам за 2 недели
✅ Гарантия качества 18 месяцев
✅ Более 1000 товаров в наличии
✅ Работаем с 2015 года

Контакты:
📞 +7 (343) 290-40-54
📧 info@larana-mebel.ru
🌐 larana-mebel.ru

{products_info}

Стратегия продаж:
1. Выяви потребность клиента (что нужно, для какой комнаты)
2. Предложи 2-3 конкретных товара из каталога
3. Упомяни преимущества (доставка, рассрочка)
4. Создай ощущение срочности ("Популярный товар", "Акция заканчивается")
5. Пригласи в каталог или к звонку

Отвечай кратко, максимум 4-5 предложений. Используй эмодзи для дружелюбности."""

    full_messages = [{'role': 'system', 'content': system_prompt}] + messages
    
    response = requests.post(
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://larana-mebel.ru',
            'X-Title': 'LARANA Assistant'
        },
        json={
            'model': 'openai/gpt-4o-mini',
            'messages': full_messages,
            'temperature': 0.7,
            'max_tokens': 300
        }
    )
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'AI API error: {response.text}'})
        }
    
    result = response.json()
    assistant_message = result['choices'][0]['message']['content']
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'message': assistant_message})
    }