export function generateSummary(text: string) {
    const sentences = text.split(". ").filter(s => s.length > 20);
    const top3 = sentences
      .sort((a, b) => b.length - a.length)
      .slice(0, 3);
  
    return top3.join(". ") + ".";
  }
  