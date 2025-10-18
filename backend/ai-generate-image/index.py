'''
Business: Generate product images using poehali.dev built-in image generation
Args: event with body containing {prompt: string}
Returns: {url: string} - URL of generated image
'''

import json
import requests
from typing import Dict, Any


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
    
    try:
        body_str = event.get('body', '{}')
        if not body_str or body_str == '':
            body_str = '{}'
        
        body_data = json.loads(body_str)
        prompt = body_data.get('prompt', '')
        
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
        
        # Call poehali.dev internal image generation API
        response = requests.post(
            'https://api.poehali.dev/ai/generate-image',
            json={'prompt': prompt},
            timeout=60
        )
        
        if response.status_code != 200:
            error_text = response.text[:200]
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Image generation failed: {response.status_code}',
                    'details': error_text
                }),
                'isBase64Encoded': False
            }
        
        result = response.json()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'url': result.get('url', ''),
                'success': True
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Internal error: {str(e)}',
                'type': type(e).__name__
            }),
            'isBase64Encoded': False
        }
