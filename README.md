# Nexium Mohiyuddin Assignment 2

## Project Overview
This project is a Next.js application that scrapes content from a blog URL, generates an English summary, and then translates that summary into Urdu. Urdu translation is performed using a local Python Flask server powered by a Hugging Face model.

---

## 1. Local Development Setup

### **A. Node/Next.js App**
1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```
2. **Create a `.env.local` file:**
   - In the project root, create a `.env.local` file and add the required keys (Supabase, MongoDB, Hugging Face token, etc.)

3. **Start the Next.js app:**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```
   - The app will run at: http://localhost:3000

### **B. Local Python Flask Translation Server**
1. **Install Python (3.8+ recommended)**
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the server:**
   ```bash
   python translate_server.py
   ```
   - The server will run at: http://localhost:5000
   - The Next.js app will automatically call this server for Urdu translation.

---

## 2. Deploying on Vercel

### **A. Next.js App (Frontend/Backend)**
1. **Create a new project on Vercel.**
2. **Connect your GitHub repository.**
3. **Set environment variables (Supabase, MongoDB, Hugging Face token, etc.)**
4. **Click Deploy.**
5. **Your app will be live on Vercel.**

### **B. Urdu Translation on Vercel**
- **Python Flask server cannot run on Vercel.**
- Urdu translation will only work in local development unless you host your Flask server on a public server (VPS/Cloud).
- In production, either the fallback dictionary translation will be used, or you must deploy the Flask server to a public service (Heroku, Render, Railway, etc.) and update your Next.js backend to use that public endpoint.

---

## 3. Quick Start Guide

- **Locally:**
  - Start the Next.js app with `pnpm dev` (or `npm run dev` / `yarn dev`)
  - Start the translation server with `python translate_server.py`
  - Open the app, enter a blog URL, and you will get both the English summary and Urdu translation
- **On Vercel:**
  - Only the Next.js app will be deployed. Urdu translation will only work if the Flask server is running on a public endpoint.

---

## 4. Useful Commands

- **Install Node dependencies:** `pnpm install` / `npm install` / `yarn install`
- **Start Next.js:** `pnpm dev` / `npm run dev` / `yarn dev`
- **Install Python dependencies:** `pip install -r requirements.txt`
- **Start Flask server:** `python translate_server.py`

---

## 5. Notes
- The Flask translation server endpoint: `http://localhost:5000/translate`
- The Next.js app will automatically call this endpoint for Urdu translation
- If the Flask server is down, the fallback dictionary translation will be used
- In production (Vercel), Urdu translation will only work if the Flask server is running on a public endpoint

---

**For more details, see `README_TRANSLATE_SERVER.md` or contact the maintainer.**
