const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models";

// Models for different tasks
const MODELS = {
  SUMMARY: "sshleifer/distilbart-cnn-12-6",         // Summary model
  TRANSLATION: "facebook/nllb-200-distilled-600M",               // English to Urdu translation
};

export async function generateAISummary(text: string): Promise<string> {
  try {
    const truncatedText = text.length > 1000 ? text.substring(0, 1000) + "..." : text;

    const response = await fetch(`${HUGGING_FACE_API_URL}/${MODELS.SUMMARY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: truncatedText }),
    });

    if (!response.ok) {
      console.error("❌ Summary API Error:", response.status, response.statusText);
      return generateSimpleSummary(text);
    }

    const result = await response.json();
    const summary = result[0]?.summary_text || result[0]?.generated_text;
    return summary || generateSimpleSummary(text);
  } catch (error) {
    console.error("❌ Error generating AI summary:", error);
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
    // Call local Flask translation server
    const response = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Local translation server failed:", response.status, errorText);
      throw new Error("Local translation server error");
    }

    const result = await response.json();
    const translation = result.translation || "";

    if (!translation) {
      console.error("❌ No translation returned from local server.");
      throw new Error("Empty translation");
    }

    return translation;
  } catch (error) {
    console.error("⚠️ Urdu translation failed, using fallback:", error);
    return translateToUrduSimple(text);
  }
}

function translateToUrduSimple(text: string): string {
  const dictionary: Record<string, string> = {
    "the": "یہ", "is": "ہے", "are": "ہیں", "was": "تھا", "were": "تھے", "will": "ہوگا",
    "can": "کر سکتا", "should": "چاہیے", "summary": "خلاصہ", "content": "مواد",
    "article": "مضمون", "blog": "بلاگ", "text": "متن", "information": "معلومات",
    "important": "اہم", "main": "اہم", "key": "اہم", "points": "نکات", "discusses": "بحث کرتا ہے",
    "explains": "وضاحت کرتا ہے", "describes": "بیان کرتا ہے", "shows": "دکھاتا ہے",
    "presents": "پیش کرتا ہے", "technology": "ٹیکنالوجی", "development": "ترقی",
    "innovation": "جدت", "research": "تحقیق", "study": "مطالعہ", "analysis": "تجزیہ",
    "report": "رپورٹ", "news": "خبریں", "update": "اپڈیٹ", "latest": "تازہ ترین",
    "new": "نیا", "modern": "جدید", "current": "موجودہ", "future": "مستقبل",
    "past": "ماضی", "present": "حال",
  };

  let translated = text;
  for (const [en, ur] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, ur);
  }

  return translated || "ترجمہ دستیاب نہیں";
}
