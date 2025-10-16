'''
Business: Отправка уведомлений о новых заказах в Telegram
Args: event - dict с httpMethod, body (данные заказа)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict со статусом отправки
'''

import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse

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
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        print('[ERROR] Telegram credentials not configured')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Telegram not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    order = body_data.get('order', {})
    
    delivery_type_map = {
        'delivery': 'Доставка',
        'pickup': 'Самовывоз'
    }
    
    payment_type_map = {
        'card': 'Картой онлайн',
        'cash': 'Наличными',
        'card_courier': 'Картой курьеру'
    }
    
    delivery_type = delivery_type_map.get(order.get('deliveryType', ''), order.get('deliveryType', 'Не указано'))
    payment_type = payment_type_map.get(order.get('paymentType', ''), order.get('paymentType', 'Не указано'))
    
    items_text = '\n'.join([
        f"• {item.get('title', 'Товар')} — {item.get('quantity', 1)} шт × {item.get('price', 0)} ₽"
        for item in order.get('items', [])
    ])
    
    message = f"""🛒 <b>Новый заказ #{order.get('orderNumber', 'N/A')}</b>

👤 <b>Клиент:</b> {order.get('name', 'Не указано')}
📧 <b>Email:</b> {order.get('email', 'Не указан')}
📱 <b>Телефон:</b> {order.get('phone', 'Не указан')}

📦 <b>Тип доставки:</b> {delivery_type}
💳 <b>Способ оплаты:</b> {payment_type}
📍 <b>Адрес:</b> {order.get('address', 'Не указан')}
🏙 <b>Город:</b> {order.get('city', 'Не указан')}

<b>Состав заказа:</b>
{items_text}

💰 <b>Итого:</b> {order.get('totalAmount', 0)} ₽
"""
    
    if order.get('comment'):
        message += f"\n💬 <b>Комментарий:</b> {order.get('comment')}"
    
    telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    try:
        req = urllib.request.Request(
            telegram_url,
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f'[SUCCESS] Telegram notification sent for order {order.get("orderNumber")}')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'result': result}),
                'isBase64Encoded': False
            }
    except Exception as e:
        print(f'[ERROR] Failed to send Telegram notification: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
