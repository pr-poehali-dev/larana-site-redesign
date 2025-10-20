'''
Business: ИИ-консультант для помощи покупателям в выборе мебели (YandexGPT)
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
    
    api_key = os.environ.get('YANDEX_API_KEY')
    folder_id = os.environ.get('YANDEX_FOLDER_ID')
    
    print(f'API Key present: {bool(api_key)}, Folder ID present: {bool(folder_id)}')
    
    if not api_key or not folder_id:
        print(f'Missing credentials - API Key: {bool(api_key)}, Folder ID: {bool(folder_id)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'YandexGPT API not configured'})
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

    yandex_messages = []
    for msg in messages:
        yandex_messages.append({
            'role': 'user' if msg['role'] == 'user' else 'assistant',
            'text': msg['content']
        })
    
    request_body = {
        'modelUri': f'gpt://{folder_id}/yandexgpt-lite',
        'completionOptions': {
            'stream': False,
            'temperature': 0.7,
            'maxTokens': 500
        },
        'messages': [
            {'role': 'system', 'text': system_prompt}
        ] + yandex_messages
    }
    
    try:
        response = requests.post(
            'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
            headers={
                'Authorization': f'Api-Key {api_key}',
                'Content-Type': 'application/json',
                'x-folder-id': folder_id
            },
            json=request_body,
            timeout=30
        )
        
        if response.status_code != 200:
            print(f'YandexGPT error: {response.status_code} - {response.text}')
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'YandexGPT API error: {response.text}'})
            }
        
        result = response.json()
        assistant_message = result['result']['alternatives'][0]['message']['text']
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'message': assistant_message})
        }
    except Exception as e:
        print(f'Exception in handler: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Internal error: {str(e)}'})
        }