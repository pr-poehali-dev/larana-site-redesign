import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Импорт карточек товаров из Ozon Seller API
    Args: event с httpMethod GET (список товаров) или POST (детали товара)
    Returns: JSON с товарами или детальной информацией о товаре
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    client_id = os.environ.get('OZON_CLIENT_ID')
    api_key = os.environ.get('OZON_API_KEY')
    
    if not client_id or not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'error': 'Ozon API ключи не настроены',
                'message': 'Добавьте OZON_CLIENT_ID и OZON_API_KEY в секреты проекта'
            })
        }
    
    if method == 'GET':
        limit = int(event.get('queryStringParameters', {}).get('limit', '100'))
        last_id = event.get('queryStringParameters', {}).get('last_id', '')
        
        request_data = {
            'filter': {
                'visibility': 'ALL'
            },
            'limit': limit
        }
        
        if last_id:
            request_data['last_id'] = last_id
        
        req = urllib.request.Request(
            'https://api-seller.ozon.ru/v3/product/list',
            data=json.dumps(request_data).encode('utf-8'),
            headers={
                'Client-Id': client_id,
                'Api-Key': api_key,
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
                print(f'Ozon v3 list: {json.dumps(result, ensure_ascii=False)[:500]}')
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(result)
                }
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            return {
                'statusCode': e.code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Ozon API error: {error_body}'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Request error: {str(e)}'})
            }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        product_ids = body_data.get('product_ids', [])
        
        if not product_ids:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'product_ids required'})
            }
        
        print(f'Запрос деталей для {len(product_ids)} товаров через v2/product/list')
        
        request_data = {
            'product_id': [int(pid) for pid in product_ids[:100]]
        }
        
        req = urllib.request.Request(
            'https://api-seller.ozon.ru/v2/product/list',
            data=json.dumps(request_data).encode('utf-8'),
            headers={
                'Client-Id': client_id,
                'Api-Key': api_key,
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
                items = result.get('result', [])
                print(f'Загружено {len(items)} товаров с атрибутами')
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'result': {'items': items}})
                }
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f'Ошибка Ozon API: {error_body}')
            return {
                'statusCode': e.code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Ozon API error: {error_body}'})
            }
        except Exception as e:
            print(f'Ошибка запроса: {str(e)}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Request error: {str(e)}'})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }