const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models";

// Models for different tasks
const MODELS = {
  SUMMARY: "sshleifer/distilbart-cnn-12-6", // Smaller, faster BART model
  TRANSLATION: "Helsinki-NLP/opus-mt-en-ur", // English to Urdu translation
};

export async function generateAISummary(text: string): Promise<string> {
  try {
    // Truncate text if too long (Hugging Face has limits)
    const truncatedText = text.length > 1000 ? text.substring(0, 1000) + "..." : text;
    
    const response = await fetch(`${HUGGING_FACE_API_URL}/${MODELS.SUMMARY}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: truncatedText,
      }),
    });

    if (!response.ok) {
      console.error("Summary API Error:", response.status, response.statusText);
      // Fallback to simple summary
      return generateSimpleSummary(text);
    }

    const result = await response.json();
    return result[0]?.summary_text || generateSimpleSummary(text);
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return generateSimpleSummary(text);
  }
}

function generateSimpleSummary(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const summary = sentences.slice(0, 2).join(". ");
  return summary + ".";
}

export async function translateToUrduAI(text: string): Promise<string> {
  try {
    // Try multiple translation models
    const translationModels = [
      "Helsinki-NLP/opus-mt-en-ur",
      "facebook/nllb-200-distilled-600M",
      "t5-small"
    ];

    for (const model of translationModels) {
      try {
        const response = await fetch(`${HUGGING_FACE_API_URL}/${model}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: model === "facebook/nllb-200-distilled-600M" 
              ? `translate English to Urdu: ${text}`
              : text,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const translation = result[0]?.translation_text || result[0]?.generated_text;
          if (translation) {
            return translation;
          }
        }
      } catch (error) {
        console.log(`Model ${model} failed, trying next...`, error);
        continue;
      }
    }

    // If all models fail, use fallback
    console.log("All translation models failed, using fallback");
    return translateToUrduSimple(text);
  } catch (error) {
    console.error("Error translating to Urdu:", error);
    return translateToUrduSimple(text);
  }
}

function translateToUrduSimple(text: string): string {
  // Simple dictionary-based translation as fallback
  const dictionary: Record<string, string> = {
    "the": "یہ",
    "is": "ہے",
    "are": "ہیں",
    "was": "تھا",
    "were": "تھے",
    "will": "ہوگا",
    "can": "کر سکتا",
    "should": "چاہیے",
    "summary": "خلاصہ",
    "content": "مواد",
    "article": "مضمون",
    "blog": "بلاگ",
    "text": "متن",
    "information": "معلومات",
    "important": "اہم",
    "main": "اہم",
    "key": "اہم",
    "points": "نکات",
    "discusses": "بحث کرتا ہے",
    "explains": "وضاحت کرتا ہے",
    "describes": "بیان کرتا ہے",
    "shows": "دکھاتا ہے",
    "presents": "پیش کرتا ہے",
    "technology": "ٹیکنالوجی",
    "development": "ترقی",
    "innovation": "جدت",
    "research": "تحقیق",
    "study": "مطالعہ",
    "analysis": "تجزیہ",
    "report": "رپورٹ",
    "news": "خبریں",
    "update": "اپڈیٹ",
    "latest": "تازہ ترین",
    "new": "نیا",
    "modern": "جدید",
    "current": "موجودہ",
    "future": "مستقبل",
    "past": "ماضی",
    "present": "حال",
  };

  let translated = text;
  for (const [en, ur] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, ur);
  }
  
  return translated || "ترجمہ دستیاب نہیں";
} 