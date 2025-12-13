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

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **AI**: Google Generative AI (Gemini Flash & Pro)
- **Editor**: Monaco Editor
- **Docs**: pdfjs-dist

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd study-bandit-clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

Deploy easily on Vercel:

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the `GEMINI_API_KEY` to the Vercel Environment Variables.
4. Deploy!

## License

MIT
