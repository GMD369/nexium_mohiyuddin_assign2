from flask import Flask, request, jsonify
from transformers import MarianMTModel, MarianTokenizer
import torch

app = Flask(__name__)

MODEL_NAME = "Helsinki-NLP/opus-mt-en-ur"
tokenizer = MarianTokenizer.from_pretrained(MODEL_NAME)
model = MarianMTModel.from_pretrained(MODEL_NAME)

def translate(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True)
    with torch.no_grad():
        translated = model.generate(**inputs)
    return tokenizer.decode(translated[0], skip_special_tokens=True)

@app.route("/translate", methods=["POST"])
def translate_route():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    try:
        urdu = translate(text)
        return jsonify({"translation": urdu})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000) 