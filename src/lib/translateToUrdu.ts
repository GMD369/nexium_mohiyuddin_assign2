const dictionary: Record<string, string> = {
    technology: "ٹیکنالوجی",
    innovation: "جدت",
    development: "ترقی",
    blog: "بلاگ",
    "artificial intelligence": "مصنوعی ذہانت",
  };
  
  export function translateToUrdu(text: string): string {
    let translated = text;
  
    for (const [en, ur] of Object.entries(dictionary)) {
      const regex = new RegExp(`\\b${en}\\b`, "gi");
      translated = translated.replace(regex, ur);
    }
  
    return translated;
  }
  