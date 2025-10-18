import json
import os
import time
from typing import Dict, Any
import urllib.request
import urllib.parse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация изображений товаров через KIE.ai API
    Args: event - dict с httpMethod, body (prompt, aspectRatio)
          context - object с атрибутами request_id, function_name
    Returns: HTTP response с URL сгенерированного изображения
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
    prompt = body_data.get('prompt', '')
    aspect_ratio = body_data.get('aspectRatio', '1:1')
    
    if not prompt:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt is required'}),
            'isBase64Encoded': False
        }
    
    kie_api_key = os.environ.get('KIE_API_KEY')
    
    if not kie_api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'KIE_API_KEY not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        generate_url = 'https://api.kie.ai/api/v1/gpt4o-image/generate'
        
        request_data = {
            'prompt': prompt,
            'aspectRatio': aspect_ratio
        }
        
        headers = {
            'Authorization': f'Bearer {kie_api_key}',
            'Content-Type': 'application/json'
        }
        
        req = urllib.request.Request(
            generate_url,
            data=json.dumps(request_data).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            response_data = json.loads(response.read().decode('utf-8'))
            
            task_id = response_data.get('data', {}).get('taskId')
            
            if not task_id:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No taskId in response', 'response': response_data}),
                    'isBase64Encoded': False
                }
        
        check_url = f'https://api.kie.ai/api/v1/gpt4o-image/task/{task_id}'
        
        max_attempts = 30
        attempt = 0
        
        while attempt < max_attempts:
            time.sleep(2)
            attempt += 1
            
            check_req = urllib.request.Request(
                check_url,
                headers={'Authorization': f'Bearer {kie_api_key}'},
                method='GET'
            )
            
            with urllib.request.urlopen(check_req, timeout=30) as check_response:
                check_data = json.loads(check_response.read().decode('utf-8'))
                
                status = check_data.get('data', {}).get('status')
                
                if status == 'completed':
                    image_url = check_data.get('data', {}).get('url')
                    
                    if image_url:
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'imageUrl': image_url}),
                            'isBase64Encoded': False
                        }
                
                elif status == 'failed':
                    return {
                        'statusCode': 500,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Image generation failed'}),
                        'isBase64Encoded': False
                    }
        
        return {
            'statusCode': 408,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Timeout waiting for image generation'}),
            'isBase64Encoded': False
        }
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'KIE API error: {error_body}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
