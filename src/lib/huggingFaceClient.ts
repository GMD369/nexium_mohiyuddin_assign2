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
