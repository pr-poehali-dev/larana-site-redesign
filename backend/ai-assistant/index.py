'''
Business: ИИ-консультант для помощи покупателям в выборе мебели
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами: request_id, function_name
Returns: HTTP response dict с ответом от ИИ-ассистента
'''
import json
import os
from typing import Dict, Any, List
from openai import OpenAI

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
    
    if not messages:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Messages required'})
        }
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'OpenAI API key not configured'})
        }
    
    client = OpenAI(api_key=api_key)
    
    system_prompt = """Ты - профессиональный консультант мебельного магазина LARANA в Екатеринбурге.

Твоя задача:
- Помогать клиентам выбрать идеальную мебель для их дома
- Задавать уточняющие вопросы о размерах помещения, стиле, бюджете
- Рассказывать о преимуществах: бесплатная доставка, сборка, рассрочка 0%
- Мотивировать к покупке, подчеркивая качество и выгодные условия
- Быть дружелюбным и профессиональным

Категории товаров:
- Кухни (готовые и на заказ)
- Спальни (кровати, тумбы, комоды)
- Гостиные (стенки, тумбы под ТВ)
- Шкафы-купе (встроенные и корпусные)
- Прихожие
- Детские комнаты

Преимущества LARANA:
✅ Бесплатная доставка и сборка
✅ Рассрочка 0% до 12 месяцев
✅ Изготовление по индивидуальным размерам
✅ Гарантия качества
✅ Более 1000 товаров в наличии
✅ Работаем с 2015 года

Контакты:
📞 +7 (343) 290-40-54
📧 info@larana-mebel.ru
🌐 larana-mebel.ru

Отвечай кратко, по делу, максимум 3-4 предложения. Используй эмодзи для дружелюбности."""

    full_messages = [{'role': 'system', 'content': system_prompt}] + messages
    
    completion = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=full_messages,
        temperature=0.7,
        max_tokens=300
    )
    
    assistant_message = completion.choices[0].message.content
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'message': assistant_message})
    }
