import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import mongoose, { Model, Document } from "mongoose";
import { connectMongo } from "@/lib/mongoClient";
import { supabase } from "@/lib/supabaseClient";
import { generateAISummary, translateToUrduAI } from "@/lib/huggingFaceClient";

// Type-safe Blog schema
interface BlogDocument extends Document {
  url: string;
  fullText: string;
  createdAt: Date;
}

let Blog: Model<BlogDocument>;

async function initBlogModel() {
  if (!Blog) {
    const schema = new mongoose.Schema<BlogDocument>({
      url: String,
      fullText: String,
      createdAt: { type: Date, default: Date.now },
    });

    Blog = mongoose.models.Blog || mongoose.model<BlogDocument>("Blog", schema);
  }
}

export async function POST(req: Request) {
  const start = Date.now();

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // 1. Scrape the page
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    $("script, style, noscript, iframe, embed, object").remove();

    const contentSelectors = [
      "main",
      "article",
      ".content",
      ".post-content",
      ".entry-content",
      ".article-content",
      ".blog-content",
      ".main-content",
      "#content",
      ".text-content",
      "p"
    ];

    let text = "";

    for (const selector of contentSelectors) {
      const content = $(selector);
      if (content.length > 0) {
        text = content.text().replace(/\s+/g, " ").trim();
        if (text.length > 200) break;
      }
    }

    // Fallback to body
    if (!text || text.length < 200) {
      text = $("body").text().replace(/\s+/g, " ").trim();
    }

    if (!text || text.length < 100) {
      return NextResponse.json({ error: "Not enough content to summarise." }, { status: 422 });
    }

    // 2. Generate AI Summary
    const summary_en = await generateAISummary(text);
    const summary_ur = await translateToUrduAI(summary_en);

    // 3. Save to Supabase
    const { error: supabaseError } = await supabase.from("summaries").insert([
      {
        url,
        summary_en,
        summary_ur,
        created_at: new Date().toISOString(),
      },
    ]);

    if (supabaseError) {
      console.error("Supabase insert error:", supabaseError);
    }

    // 4. Save full text to MongoDB
    await connectMongo();
    await initBlogModel();
    await Blog.create({ url, fullText: text });

    const end = Date.now();
    console.log(`✅ Summarisation completed in ${end - start}ms`);

    return NextResponse.json({ summary_en, summary_ur });
  } catch (err) {
    console.error("❌ Error in summarise route:", err);
    return NextResponse.json({ error: (err as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
