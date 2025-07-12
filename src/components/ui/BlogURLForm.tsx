"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BlogURLForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");

    try {
      toast.info("Generating summary...");

      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.summary_ur) {
        toast.success("Summary generated!");
        setSummary(data.summary_ur);
      } else {
        toast.warning("No summary found.");
        setSummary("کوئی خلاصہ نہیں ملا");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to fetch summary.");
      setSummary("خلاصہ حاصل کرنے میں مسئلہ آیا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 pt-16 font-poppins">

      {/* Animated background */}
      <div className="absolute inset-0 animate-pulse opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500 via-purple-500 to-blue-500 z-0" />

      {/* Header outside container */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-3">
          {"Blog Summariser".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block opacity-0 translate-y-4 animate-fade-in-up"
              style={{
                animationDelay: `${i * 0.05}s`,
                animationFillMode: "forwards",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p className="text-white text-opacity-80 leading-relaxed p-5 text-sm">
          This web app allows you to paste a blog URL, automatically extracts readable content,
          generates a simulated AI summary, and translates it into Urdu. The summary is saved in Supabase and the full blog in MongoDB.
        </p>
      </div>

      {/* Form container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl shadow-2xl max-w-xl mx-auto px-6 sm:px-8 py-10 space-y-6"
      >
        <Input
          type="url"
          placeholder="Paste blog URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            "Generate Summary"
          )}
        </Button>

        {summary && (
          <div className="mt-6 p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-right font-urdu leading-loose tracking-wide text-lg">
            <h2 className="font-bold text-lg mb-2 border-b border-white/20 pb-1">
              اردو خلاصہ:
            </h2>
            <p>{summary}</p>
          </div>
        )}
      </form>
    </div>
  );
}
