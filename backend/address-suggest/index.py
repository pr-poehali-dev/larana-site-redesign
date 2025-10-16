'''
Business: Автоподсказки адресов через DaData API
Args: event - dict с queryStringParameters['query'] (текст для поиска)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict со списком адресных подсказок
'''

import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    query = params.get('query', '')
    
    if not query or len(query) < 3:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'suggestions': []}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('DADATA_API_KEY')
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'DaData API key not configured'}),
            'isBase64Encoded': False
        }
    
    url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
    
    request_data = json.dumps({'query': query, 'count': 5}).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=request_data,
        headers={
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Token {api_key}'
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'DaData API error: {str(e)}'}),
            'isBase64Encoded': False
        }
    
    suggestions = []
    for item in data.get('suggestions', []):
        suggestion = {
            'value': item.get('value'),
            'fullAddress': item.get('unrestricted_value'),
            'postalCode': item.get('data', {}).get('postal_code'),
            'city': item.get('data', {}).get('city_with_type') or item.get('data', {}).get('region_with_type'),
            'street': item.get('data', {}).get('street_with_type'),
            'house': item.get('data', {}).get('house'),
            'flat': item.get('data', {}).get('flat')
        }
        
        geo_lat = item.get('data', {}).get('geo_lat')
        geo_lon = item.get('data', {}).get('geo_lon')
        if geo_lat and geo_lon:
            suggestion['coordinates'] = {'lat': geo_lat, 'lon': geo_lon}
        else:
            suggestion['coordinates'] = None
        
        suggestions.append(suggestion)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'suggestions': suggestions}),
        'isBase64Encoded': False
    }