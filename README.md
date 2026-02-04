# Padh Lo Yaar

A comprehensive AI-powered study toolbox built with Next.js 14, TailwindCSS, shadcn/ui, and Google Gemini.

## Features

- **AI Tutor**: Personalized explanations (Simple, Detailed, ELI5).
- **Code Transformer**: Convert, style, and optimize code with Monaco Editor.
- **Question Solver**: Text & Image inputs (OCR) to solve academic problems.
- **PDF Explainer**: Chat with your PDFs using Gemini Pro context window.
- **Exam Generator**: Create practice exams (MCQ/Written) on any topic.
- **Teacher Chat**: Voice-enabled conversational oral exam practice.
- **Diagram Explainer**: Understand complex diagrams and charts visually.
- **Cheat Sheet Generator**: Instant summaries, formulas, and tables.
- **Study Tools**: Pomodoro Timer, Music Player (Mock), Social Links.
- **Scratchpad**: Floating widget with Tabs for **Rich Text Notes** (TipTap) and **Infinite Whiteboard** (tldraw).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui, framer-motion
- **State Management**: Zustand, Persist Middleware
- **AI Models**: Google Gemini (Flash 1.5 & Pro 1.5) via `google-generative-ai`
- **Editors**: 
  - **Code**: Monaco Editor
  - **Text**: TipTap (Rich Text)
  - **Visual**: tldraw (Whiteboard)
- **Docs**: pdfjs-dist

## 🎨 Themes & Customization
Padh Lo Yaar features a dynamic theme system inspired by popular culture and aesthetics:
- **Standard**: Light, Dark, Pitch Black (OLED)
- **Colors**: Red, Cyan
- **Series Inspired**:
  - **Stranger Things**: 80s Retro Serif, Neon Red, Deep Eerie Black.
  - **Money Heist**: Industrial Sans, Jumpsuit Red, Gold Accents.
  - **Dark**: Gloomy Atmos, Raincoat Yellow, Monospace Time-Travel vibe.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd padh-lo-yaar-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Deployment
The app is optimized for Vercel. Simply import the repo and add your environment variables.

## License

MIT
