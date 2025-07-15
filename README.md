# Blog Summariser

This web app allows you to paste a blog URL, automatically extracts readable content, generates an AI summary in English (using Hugging Face), and translates it into Urdu (using Google Gemini API). Summaries are saved in Supabase and the full blog content is stored in MongoDB.

## Features
- Paste any blog URL and get a concise summary in English and Urdu.
- English summary powered by Hugging Face's summarization model.
- Urdu translation powered by Google Gemini API.
- Summaries are saved in Supabase for record-keeping.
- Full blog text is stored in MongoDB.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API routes
- **AI Models:**
  - Hugging Face (English summarization)
  - Google Gemini (Urdu translation)
- **Database:**
  - Supabase (summaries)
  - MongoDB (full blog content)

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd nexium_mohiyuddin_assign2
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   MONGO_URI=your_mongodb_connection_string
   HUGGING_FACE_TOKEN=your_huggingface_token
   ```
4. **Run the development server:**
   ```bash
   pnpm dev
   ```
5. **Open the app:**
   Go to [http://localhost:3000](http://localhost:3000)

## Usage
- Paste a blog URL in the input field and click "Generate Summary".
- The app will display both English and Urdu summaries.

## Notes
- No Python or Flask server is required. All translation is handled via Gemini API.
- Make sure your API keys are valid and have sufficient quota.


