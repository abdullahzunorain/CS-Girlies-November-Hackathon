---
description: Complete API documentation for developers
---

# 📡 API Reference

## Base URL

```
Development: http://localhost:5000
Production: https://your-api-domain.com
```

## Authentication

Currently, no authentication is required for the MVP. In production, consider implementing:

* API keys
* JWT tokens
* OAuth 2.0

---

## Endpoints

### Health Check

Check if the API is running.

{% swagger method="get" path="/" baseUrl="http://localhost:5000" summary="Health Check" %}
{% swagger-description %}
Returns server status and basic information.
{% endswagger-description %}

{% swagger-response status="200: OK" description="Server is running" %}
```json
{
  "status": "running",
  "message": "CS Girlies Hackathon API",
  "project": "Your Project Name"
}
```
{% endswagger-response %}
{% endswagger %}

**Example:**
```bash
curl http://localhost:5000/
```

---

### Process Text

Process user input with AI.

{% swagger method="post" path="/api/process" baseUrl="http://localhost:5000" summary="Process Text with AI" %}
{% swagger-description %}
Sends text content to AI for processing and returns results.
{% endswagger-description %}

{% swagger-parameter in="body" name="text" type="string" required="true" %}
The text content to process
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Successfully processed" %}
```json
{
  "original": "User's input text",
  "processed": "AI processed result",
  "status": "success",
  "message": "Processing complete"
}
```
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="Missing or invalid input" %}
```json
{
  "error": "Missing text field in request"
}
```
{% endswagger-response %}

{% swagger-response status="500: Internal Server Error" description="Processing failed" %}
```json
{
  "error": "Error message",
  "status": "failed"
}
```
{% endswagger-response %}
{% endswagger %}

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Explain quantum computing in simple terms"
  }'
```

**Example Response:**
```json
{
  "original": "Explain quantum computing in simple terms",
  "processed": "Quantum computing is a type of computing that uses quantum mechanics...",
  "status": "success"
}
```

---

### Generate Content

Generate educational content (quizzes, flashcards, etc.).

{% swagger method="post" path="/api/generate" baseUrl="http://localhost:5000" summary="Generate Content" %}
{% swagger-description %}
Generate various types of educational content based on prompts.
{% endswagger-description %}

{% swagger-parameter in="body" name="prompt" type="string" required="true" %}
The generation prompt
{% endswagger-parameter %}

{% swagger-parameter in="body" name="type" type="string" %}
Content type: "quiz", "flashcard", "summary"
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Content generated" %}
```json
{
  "generated_content": "Generated educational content here",
  "prompt": "Original prompt",
  "type": "quiz"
}
```
{% endswagger-response %}
{% endswagger %}

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a quiz about photosynthesis",
    "type": "quiz"
  }'
```

---

### Analyze Content

Analyze educational content for difficulty, concepts, etc.

{% swagger method="post" path="/api/analyze" baseUrl="http://localhost:5000" summary="Analyze Content" %}
{% swagger-description %}
Analyzes content and returns insights about difficulty, key concepts, etc.
{% endswagger-description %}

{% swagger-parameter in="body" name="content" type="string" required="true" %}
Content to analyze
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Analysis complete" %}
```json
{
  "analysis": {
    "difficulty": "intermediate",
    "key_concepts": ["concept1", "concept2"],
    "summary": "Brief analysis summary"
  }
}
```
{% endswagger-response %}
{% endswagger %}

---

## Request/Response Formats

### Request Headers
```
Content-Type: application/json
Accept: application/json
```

### Common Response Format
```json
{
  "status": "success|failed",
  "data": { ... },
  "error": "Error message (if failed)"
}
```

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Internal processing error |

---

## Rate Limiting

**Current:** No rate limiting (MVP)

**Recommended for Production:**
* 100 requests per minute per IP
* 1000 requests per hour per user

---

## Code Examples

### JavaScript (Frontend)

```javascript
async function processText(text) {
  const response = await fetch('http://localhost:5000/api/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  });
  
  const data = await response.json();
  return data;
}
```

### Python (Testing)

```python
import requests

url = 'http://localhost:5000/api/process'
data = {'text': 'Your learning content here'}

response = requests.post(url, json=data)
print(response.json())
```

### cURL

```bash
# Process text
curl -X POST http://localhost:5000/api/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Your content"}'

# Generate quiz
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a quiz about...", "type":"quiz"}'
```

---

## Testing

Use these sample requests to test the API:

```bash
# Test 1: Health check
curl http://localhost:5000/

# Test 2: Process simple text
curl -X POST http://localhost:5000/api/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Test content"}'

# Test 3: Generate content
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test prompt"}'
```

---

## Postman Collection

Import this collection into Postman for easy testing:

```json
{
  "info": {
    "name": "CS Girlies Hackathon API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/"
      }
    },
    {
      "name": "Process Text",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/process",
        "body": {
          "mode": "raw",
          "raw": "{\"text\":\"Your content here\"}"
        }
      }
    }
  ]
}
```

---

**Need help?** Check our [FAQ](faq.md) or [Architecture](architecture.md) docs.
