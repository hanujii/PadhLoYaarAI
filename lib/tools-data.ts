import {
    GraduationCap,
    Code,
    Calculator,
    FileText,
    PenTool,
    Mic,
    Image,
    Table,
    Layers,
    Youtube,
    Map,
    RotateCcw,
    ListChecks,
    Smile,
    Link as LinkIcon,
    Brain,
    FileQuestion,
} from 'lucide-react';

export const TOOLS = [
    {
        title: "Tutor Tool",
        description: "Get step-by-step explanations for any topic.",
        href: "/tools/tutor",
        icon: GraduationCap,
        color: "bg-blue-50 dark:bg-blue-950/20",
        value: "tutor", // used for command center
        keywords: ["tutor", "learn", "explain", "study"],
        queryParam: "topic"
    },
    {
        title: "Code Transformer",
        description: "Convert, style, and fix code snippets.",
        href: "/tools/code-transformer",
        icon: Code,
        color: "bg-green-50 dark:bg-green-950/20",
        value: "code-transformer",
        keywords: ["code", "convert", "transform", "fix", "debug"],
        queryParam: "q"
    },
    {
        title: "Question Solver",
        description: "Solve problems from text or images.",
        href: "/tools/question-solver",
        icon: Calculator,
        color: "bg-orange-50 dark:bg-orange-950/20",
        value: "question-solver",
        keywords: ["solve", "math", "question", "problem"],
        queryParam: "q"
    },
    {
        title: "PDF Explainer",
        description: "Chat with your PDF documents.",
        href: "/tools/pdf-explainer",
        icon: FileText,
        color: "bg-red-50 dark:bg-red-950/20",
        value: "pdf-explainer",
        keywords: ["pdf", "document", "chat", "summarize"],
        queryParam: "q"
    },
    {
        title: "Exam Generator",
        description: "Create practice exams on any subject.",
        href: "/tools/exam-generator",
        icon: PenTool,
        color: "bg-purple-50 dark:bg-purple-950/20",
        value: "exam-generator",
        keywords: ["exam", "test", "quiz", "generate"],
        queryParam: "topic"
    },
    {
        title: "Teacher Chat",
        description: "Conversational voice practice.",
        href: "/tools/teacher-chat",
        icon: Mic,
        color: "bg-yellow-50 dark:bg-yellow-950/20",
        value: "teacher-chat",
        keywords: ["teacher", "chat", "voice", "conversation"],
        queryParam: "topic"
    },
    {
        title: "Diagram Explainer",
        description: "Understand complex diagrams visually.",
        href: "/tools/diagram-explainer",
        icon: Image,
        color: "bg-pink-50 dark:bg-pink-950/20",
        value: "diagram-explainer",
        keywords: ["diagram", "image", "visual", "explain"],
        queryParam: "q"
    },
    {
        title: "Cheat Sheet",
        description: "Generate summaries and tables instantly.",
        href: "/tools/cheat-sheet",
        icon: Table,
        color: "bg-cyan-50 dark:bg-cyan-950/20",
        value: "cheat-sheet",
        keywords: ["cheat", "sheet", "summary", "table", "notes"],
        queryParam: "topic"
    },
    {
        title: "Flashcard Genius",
        description: "Master topics with active recall cards.",
        href: "/tools/flashcards",
        icon: Layers,
        color: "bg-indigo-50 dark:bg-indigo-950/20",
        value: "flashcards",
        keywords: ["flashcard", "cards", "recall", "study"],
        queryParam: "topic"
    },
    {
        title: "YouTube Note-Taker",
        description: "Summarize video lectures instantly.",
        href: "/tools/youtube-notes",
        icon: Youtube,
        color: "bg-red-50 dark:bg-red-950/20",
        value: "youtube-notes",
        keywords: ["youtube", "video", "notes", "summary"],
        queryParam: "url"
    },
    {
        title: "Roadmap Architect",
        description: "Generate day-by-day study plans.",
        href: "/tools/roadmap",
        icon: Map,
        color: "bg-blue-50 dark:bg-blue-950/20",
        value: "roadmap",
        keywords: ["roadmap", "plan", "schedule", "study"],
        queryParam: "topic"
    },
    {
        title: "The Reverse Exam",
        description: "Catch the AI's mistakes.",
        href: "/tools/reverse-exam",
        icon: RotateCcw,
        color: "bg-orange-50 dark:bg-orange-950/20",
        value: "reverse-exam",
        keywords: ["reverse", "exam", "mistake", "correction"],
        queryParam: "topic"
    },
    {
        title: "Syllabus Sentinel",
        description: "Track progress from your PDF syllabus.",
        href: "/tools/syllabus",
        icon: ListChecks,
        color: "bg-emerald-50 dark:bg-emerald-950/20",
        value: "syllabus",
        keywords: ["syllabus", "track", "progress", "course"],
        queryParam: "topic"
    },
    {
        title: "Meme-ory Mode",
        description: "Learn concepts through memes.",
        href: "/tools/meme",
        icon: Smile,
        color: "bg-yellow-50 dark:bg-yellow-950/20",
        value: "meme",
        keywords: ["meme", "funny", "learn", "image"],
        queryParam: "topic"
    },
    {
        title: "Analogy Engine",
        description: "Explain things with your interests.",
        href: "/tools/analogy",
        icon: LinkIcon,
        color: "bg-pink-50 dark:bg-pink-950/20",
        value: "analogy",
        keywords: ["analogy", "compare", "like", "metaphor"],
        queryParam: "topic"
    },
    {
        title: "Roast My Code",
        description: "Get sarcastic, fiery feedback on your code.",
        href: "/tools/roast-my-code",
        icon: Brain,
        color: "bg-red-50 dark:bg-red-950/20",
        value: "roast-my-code",
        keywords: ["roast", "review", "code", "criticize", "bad"],
        queryParam: "q"
    },
    {
        title: "Exam Simulator",
        description: "Practice under pressure with AI exams.",
        href: "/tools/exam-simulator",
        icon: FileQuestion,
        color: "bg-blue-50 dark:bg-blue-950/20",
        value: "exam-simulator",
        keywords: ["simulator", "exam", "test", "practice"],
        queryParam: "topic"
    },
    {
        title: "Knowledge Galaxy",
        description: "Visualize your learning journey in 3D.",
        href: "/tools/knowledge-galaxy",
        icon: Brain,
        color: "bg-purple-900/50 text-white dark:bg-purple-900/50", // Special distinct color
        value: "knowledge-galaxy",
        keywords: ["galaxy", "3d", "visualize", "graph", "history"],
        queryParam: "q"
    },
    {
        title: "Zen Focus Station",
        description: "Immersive distraction-free study environment.",
        href: "/tools/zen-station",
        icon: Brain, // Using Brain temporarily, ideally a Lotus or Focus icon if available, or just reuse Brain
        color: "bg-emerald-900/50 text-white dark:bg-emerald-900/50",
        value: "zen-station",
        keywords: ["zen", "focus", "timer", "distraction", "study"],
        queryParam: "q"
    },
    {
        title: "AI Podcast Generator",
        description: "Turn topics into engaging audio conversations.",
        href: "/tools/podcast",
        icon: Mic, // Reusing Mic, or use a Podcast icon if available
        color: "bg-pink-600/50 text-white dark:bg-pink-600/50",
        value: "podcast",
        keywords: ["podcast", "audio", "listen", "conversation", "generate"],
        queryParam: "topic"
    },
    {
        title: "Jarvis Voice Mode",
        description: "Hands-free AI voice assistant.",
        href: "/tools/jarvis",
        icon: Mic, // Using Mic, or Bot
        color: "bg-cyan-600/50 text-white dark:bg-cyan-600/50",
        value: "jarvis",
        keywords: ["jarvis", "voice", "assistant", "speak", "talk"],
        queryParam: "q"
    },
    {
        title: "AI Examiner (Viva)",
        description: "Practice oral exams with a strict AI examiner.",
        href: "/tools/viva-examiner",
        icon: Mic,
        color: "bg-red-600/50 text-white dark:bg-red-600/50",
        value: "viva-examiner",
        keywords: ["viva", "exam", "oral", "interview", "voice"],
        queryParam: "topic"
    }
];
