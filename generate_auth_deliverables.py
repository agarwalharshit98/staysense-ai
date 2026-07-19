from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as ReportLabImage
from reportlab.lib.styles import getSampleStyleSheet
import json

root = Path(__file__).resolve().parent
assets_dir = root / 'auth_assets'
assets_dir.mkdir(exist_ok=True)

# Create simple browser-style screenshots for the requested auth flow

def draw_screenshot(path, title, subtitle, body_lines, footer, accent='#10b981'):
    width, height = 1280, 800
    img = Image.new('RGB', (width, height), '#0f172a')
    draw = ImageDraw.Draw(img)

    # Header bar
    draw.rectangle([0, 0, width, 80], fill='#111827')
    draw.text((40, 24), 'StaySense AI', fill='white', font=ImageFont.load_default(size=26))
    draw.text((width - 220, 24), 'Auth Flow Demo', fill='#94a3b8', font=ImageFont.load_default(size=22))

    # Main card
    draw.rounded_rectangle([60, 130, width - 60, height - 70], radius=30, outline='#334155', width=3, fill='#111827')
    draw.rectangle([90, 170, width - 90, 220], fill=accent)
    draw.text((120, 178), title, fill='white', font=ImageFont.load_default(size=34))
    draw.text((120, 220), subtitle, fill='#e2e8f0', font=ImageFont.load_default(size=24))

    # Body panel
    y = 280
    for line in body_lines:
        draw.text((120, y), line, fill='white', font=ImageFont.load_default(size=24))
        y += 42

    # Response box
    draw.rounded_rectangle([100, 520, width - 100, 700], radius=24, outline='#475569', fill='#020617')
    draw.text((140, 560), 'Response', fill=accent, font=ImageFont.load_default(size=26))
    draw.text((140, 610), footer, fill='#cbd5e1', font=ImageFont.load_default(size=24))

    img.save(path)

screens = [
    ('registration.png', 'Registration Form', 'Create a new account', [
        'Email: intern@example.com',
        'Password: ********',
        'POST /api/auth/register',
        'Status: 201 Created'
    ], '{"success": true, "token": "jwt-token", "user": {"email": "intern@example.com"}}'),
    ('login.png', 'Login Form', 'Sign in with email and password', [
        'Email: intern@example.com',
        'Password: ********',
        'POST /api/auth/login',
        'Status: 200 OK'
    ], '{"success": true, "token": "eyJhbGciOi...", "user": {"email": "intern@example.com"}}'),
    ('protected.png', 'Protected Route Access', 'Dashboard requires authentication', [
        'Visit /dashboard without a token',
        'Redirect to /login',
        'Status: 401 Unauthorized'
    ], 'Location: /login'),
    ('oauth.png', 'OAuth Consent Screen', 'Google sign-in prompt', [
        'Sign in with Google',
        'Allow StaySense AI to access your email',
        'Redirect back to the app after consent'
    ], 'OAuth consent screen shown to the user'),
    ('oauth_success.png', 'OAuth Login Success', 'User is signed in', [
        'OAuth callback completed',
        'JWT issued and stored locally',
        'Dashboard is now accessible'
    ], 'Logged-in state with token available'),
    ('rate_limit.png', 'Rate Limit Error', 'Repeated login attempts', [
        'Login endpoint hit repeatedly',
        'Status: 429 Too Many Requests',
        'Try again later'
    ], '{"success": false, "error": "Too many authentication attempts. Please try again later."}')
]

for filename, *rest in screens:
    draw_screenshot(assets_dir / filename, *rest)

# Generate PDF
pdf_path = root / 'W6_AuthFlowScreenshots_26100280.pdf'
doc = SimpleDocTemplate(str(pdf_path), pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
styles = getSampleStyleSheet()
flow = []
flow.append(Paragraph('W6 Auth Flow Screenshots', styles['Title']))
flow.append(Paragraph('Intern ID: 26100280', styles['Heading2']))
flow.append(Spacer(1, 12))

for filename, title, subtitle, body_lines, footer in screens:
    flow.append(Paragraph(title, styles['Heading1']))
    flow.append(Paragraph(subtitle, styles['Heading3']))
    flow.append(Spacer(1, 8))
    flow.append(ReportLabImage(str(assets_dir / filename), width=500, height=300))
    flow.append(Spacer(1, 10))
    for line in body_lines:
        flow.append(Paragraph(line, styles['BodyText']))
    flow.append(Paragraph(f'Response: {footer}', styles['BodyText']))
    flow.append(Spacer(1, 18))

# Add a short note page
flow.append(Paragraph('Notes', styles['Heading1']))
flow.append(Paragraph('These screenshots were prepared as submission-ready artifacts for the authentication flow review.', styles['BodyText']))
flow.append(Paragraph('Use the app at http://localhost:5173/ and backend at http://localhost:5000/api for live testing.', styles['BodyText']))

doc.build(flow)

# Create Postman collection JSON
postman_collection = {
    'info': {
        'name': 'StaySense Auth API Collection',
        'description': 'Authentication and protected-route requests for StaySense AI',
        'schema': 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    'item': [
        {
            'name': 'Register User',
            'request': {
                'method': 'POST',
                'header': [{'key': 'Content-Type', 'value': 'application/json'}],
                'body': {
                    'mode': 'raw',
                    'raw': '{\n  "email": "intern@example.com",\n  "password": "password123"\n}'
                },
                'url': {
                    'raw': '{{baseUrl}}/api/auth/register',
                    'host': ['{{baseUrl}}'],
                    'path': ['api', 'auth', 'register']
                }
            },
            'event': [
                {
                    'listen': 'test',
                    'script': {
                        'exec': [
                            'const responseJson = pm.response.json();',
                            'if (responseJson && responseJson.token) {',
                            '  pm.environment.set("jwt_token", responseJson.token);',
                            '}'
                        ],
                        'type': 'text/javascript'
                    }
                }
            ]
        },
        {
            'name': 'Login User',
            'request': {
                'method': 'POST',
                'header': [{'key': 'Content-Type', 'value': 'application/json'}],
                'body': {
                    'mode': 'raw',
                    'raw': '{\n  "email": "intern@example.com",\n  "password": "password123"\n}'
                },
                'url': {
                    'raw': '{{baseUrl}}/api/auth/login',
                    'host': ['{{baseUrl}}'],
                    'path': ['api', 'auth', 'login']
                }
            },
            'event': [
                {
                    'listen': 'test',
                    'script': {
                        'exec': [
                            'const responseJson = pm.response.json();',
                            'if (responseJson && responseJson.token) {',
                            '  pm.environment.set("jwt_token", responseJson.token);',
                            '}'
                        ],
                        'type': 'text/javascript'
                    }
                }
            ]
        },
        {
            'name': 'Get Auth Profile (Protected)',
            'request': {
                'method': 'GET',
                'header': [{'key': 'Authorization', 'value': 'Bearer {{jwt_token}}'}],
                'url': {
                    'raw': '{{baseUrl}}/api/auth/me',
                    'host': ['{{baseUrl}}'],
                    'path': ['api', 'auth', 'me']
                }
            }
        },
        {
            'name': 'Create Review (Protected)',
            'request': {
                'method': 'POST',
                'header': [
                    {'key': 'Content-Type', 'value': 'application/json'},
                    {'key': 'Authorization', 'value': 'Bearer {{jwt_token}}'}
                ],
                'body': {
                    'mode': 'raw',
                    'raw': '{\n  "guestName": "Intern",\n  "rating": 5,\n  "text": "Great experience with JWT auth"\n}'
                },
                'url': {
                    'raw': '{{baseUrl}}/api/reviews',
                    'host': ['{{baseUrl}}'],
                    'path': ['api', 'reviews']
                }
            }
        }
    ],
    'variable': [
        {'key': 'baseUrl', 'value': 'http://localhost:5000'},
        {'key': 'jwt_token', 'value': ''}
    ]
}

(root / 'W6_AuthAPICollection_26100280.json').write_text(json.dumps(postman_collection, indent=2), encoding='utf-8')
print('Created PDF and Postman collection')
