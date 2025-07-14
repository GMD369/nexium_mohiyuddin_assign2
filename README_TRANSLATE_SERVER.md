# English to Urdu Translation Flask Server

This server provides a REST API for English to Urdu translation using Hugging Face's Helsinki-NLP/opus-mt-en-ur model.

## Requirements
- Python 3.8+
- pip

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Download model weights (first run will do this automatically).

3. Run the server:
   ```bash
   python translate_server.py
   ```
   The server will start at http://localhost:5000

## API Usage

### POST /translate
- **Body:** `{ "text": "Your English text here" }`
- **Response:** `{ "translation": "...urdu..." }`

Example using curl:
```bash
curl -X POST http://localhost:5000/translate -H "Content-Type: application/json" -d '{"text": "Hello, how are you?"}'
```

## Integrate with Next.js
- Update your Next.js backend to POST to `http://localhost:5000/translate` for translation.
- Use the returned `translation` field as the Urdu translation.

---
**Note:**
- The first translation may take longer as the model loads.
- This server must be running for your Next.js app to get Urdu translations. 