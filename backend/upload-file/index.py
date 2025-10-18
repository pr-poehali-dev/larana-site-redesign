'''
Business: Upload file directly from browser to CDN via multipart/form-data
Args: event with multipart form data containing file
Returns: {url: string} - CDN URL of uploaded file
'''

import json
import base64
import requests
from typing import Dict, Any
import re


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
        body = event.get('body', '')
        is_base64_encoded = event.get('isBase64Encoded', False)
        
        if is_base64_encoded:
            body_bytes = base64.b64decode(body)
        else:
            body_bytes = body.encode('latin1') if isinstance(body, str) else body
        
        headers = event.get('headers', {})
        content_type = headers.get('content-type') or headers.get('Content-Type', '')
        
        if 'multipart/form-data' not in content_type:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Content-Type must be multipart/form-data'}),
                'isBase64Encoded': False
            }
        
        # Extract boundary from Content-Type
        boundary_match = re.search(r'boundary=([^;]+)', content_type)
        if not boundary_match:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Boundary not found in Content-Type'}),
                'isBase64Encoded': False
            }
        
        # Forward the multipart data to poehali CDN
        upload_response = requests.post(
            'https://api.poehali.dev/upload',
            data=body_bytes,
            headers={'Content-Type': content_type},
            timeout=30
        )
        
        if upload_response.status_code != 200:
            error_text = upload_response.text[:200]
            return {
                'statusCode': upload_response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Upload failed: {upload_response.status_code}',
                    'details': error_text
                }),
                'isBase64Encoded': False
            }
        
        upload_data = upload_response.json()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'url': upload_data.get('url', ''),
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
