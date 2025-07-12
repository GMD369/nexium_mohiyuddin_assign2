import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { connectMongo } from "@/lib/mongoClient";
import { supabase } from "@/lib/supabaseClient";
import { generateSummary } from "@/lib/summarise";
import { translateToUrdu } from "@/lib/translateToUrdu";

// MongoDB model (temporary in-memory)
let Blog: any;

async function initBlogModel() {
  if (!Blog) {
    const mongoose = (await import("mongoose")).default;
    const schema = new mongoose.Schema({
      url: String,
      fullText: String,
      createdAt: { type: Date, default: Date.now },
    });
    Blog = mongoose.models.Blog || mongoose.model("Blog", schema);
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    // 1. Scrape the page
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const text = $("body").text().replace(/\s+/g, " ").trim();

    if (!text || text.length < 100) {
      return NextResponse.json({ error: "Not enough content to summarise." }, { status: 422 });
    }

    // 2. Generate summary
    const summary_en = generateSummary(text);
    const summary_ur = translateToUrdu(summary_en);

    // 3. Save to Supabase
    await supabase.from("summaries").insert([
      {
        url,
        summary_en,
        summary_ur,
        created_at: new Date().toISOString(),
      },
    ]);

    // 4. Save full blog to Mongo
    await connectMongo();
    await initBlogModel();
    await Blog.create({ url, fullText: text });

    return NextResponse.json({ summary_en, summary_ur });
  } catch (err) {
    console.error("Error in summarise route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
