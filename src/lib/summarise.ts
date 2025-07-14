export function generateSummary(text: string) {
    // Clean the text - remove excessive whitespace and special characters
    const cleanText = text
      .replace(/\s+/g, " ")
      .replace(/[^\w\s\.\,\!\?\-]/g, " ")
      .trim();
    
    // Split into sentences and filter out very short or very long sentences
    const sentences = cleanText
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 30 && s.length < 500)
      .filter(s => !s.includes("function") && !s.includes("var ") && !s.includes("const ") && !s.includes("let "))
      .filter(s => !s.includes("http") && !s.includes("www"))
      .filter(s => s.split(" ").length > 5); // At least 5 words
    
    if (sentences.length === 0) {
      return "This content could not be summarized due to insufficient readable text.";
    }
    
    // Take the first 2-3 meaningful sentences
    const topSentences = sentences.slice(0, 3);
  
    return topSentences.join(". ") + ".";
  }
  