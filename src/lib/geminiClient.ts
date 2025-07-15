import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function translateToUrduGemini(text: string): Promise<string> {
  const prompt = `Translate the following text to Urdu. Only return the translation, no explanation.\n\n${text}`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // or latest available
    contents: prompt,
  });
  // Defensive extraction for SDK response
  if (
    response.candidates &&
    response.candidates.length > 0 &&
    response.candidates[0].content &&
    response.candidates[0].content.parts &&
    response.candidates[0].content.parts.length > 0
  ) {
    return response.candidates[0].content.parts[0].text;
  }
  return "ترجمہ دستیاب نہیں ہے";
} 