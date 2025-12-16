'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Hero3D } from '@/components/global/Hero3D';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  Code,
  FileQuestion,
  FileText,
  Brain,
  MessageSquare,
  Image,
  Database,
  GraduationCap,
  Calculator,
  PenTool,
  Mic,
  Table,
  Layers,
  Youtube,
  Map,
  RotateCcw,
  ListChecks,
  Smile,
  Link as LinkIcon,
  Sparkles,
  Github,
  Flame,
  Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopicTyper } from '@/components/global/TopicTyper';
import { TOPICS } from '@/lib/topics';
import { CommandCenter } from '@/components/global/CommandCenter';

export default function Home() {
  const tools = [
    {
      title: "Tutor Tool",
      description: "Get step-by-step explanations for any topic.",
      href: "/tools/tutor",
      icon: <GraduationCap className="w-8 h-8 mb-2 text-primary" />,
      color: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Code Transformer",
      description: "Convert, style, and fix code snippets.",
      href: "/tools/code-transformer",
      icon: <Code className="w-8 h-8 mb-2 text-green-600" />,
      color: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Question Solver",
      description: "Solve problems from text or images.",
      href: "/tools/question-solver",
      icon: <Calculator className="w-8 h-8 mb-2 text-orange-600" />,
      color: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      title: "PDF Explainer",
      description: "Chat with your PDF documents.",
      href: "/tools/pdf-explainer",
      icon: <FileText className="w-8 h-8 mb-2 text-red-600" />,
      color: "bg-red-50 dark:bg-red-950/20"
    },
    {
      title: "Exam Generator",
      description: "Create practice exams on any subject.",
      href: "/tools/exam-generator",
      icon: <PenTool className="w-8 h-8 mb-2 text-purple-600" />,
      color: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Teacher Chat",
      description: "Conversational voice practice.",
      href: "/tools/teacher-chat",
      icon: <Mic className="w-8 h-8 mb-2 text-yellow-600" />,
      color: "bg-yellow-50 dark:bg-yellow-950/20"
    },
    {
      title: "Diagram Explainer",
      description: "Understand complex diagrams visually.",
      href: "/tools/diagram-explainer",
      icon: <Image className="w-8 h-8 mb-2 text-pink-600" />,
      color: "bg-pink-50 dark:bg-pink-950/20"
    },
    {
      title: "Cheat Sheet",
      description: "Generate summaries and tables instantly.",
      href: "/tools/cheat-sheet",
      icon: <Table className="w-8 h-8 mb-2 text-cyan-600" />,
      color: "bg-cyan-50 dark:bg-cyan-950/20"
    },
    {
      title: "Flashcard Genius",
      description: "Master topics with active recall cards.",
      href: "/tools/flashcards",
      icon: <Layers className="w-8 h-8 mb-2 text-indigo-500" />,
      color: "bg-indigo-50 dark:bg-indigo-950/20"
    },
    {
      title: "YouTube Note-Taker",
      description: "Summarize video lectures instantly.",
      href: "/tools/youtube-notes",
      icon: <Youtube className="w-8 h-8 mb-2 text-red-500" />,
      color: "bg-red-50 dark:bg-red-950/20"
    },
    {
      title: "Roadmap Architect",
      description: "Generate day-by-day study plans.",
      href: "/tools/roadmap",
      icon: <Map className="w-8 h-8 mb-2 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "The Reverse Exam",
      description: "Catch the AI's mistakes.",
      href: "/tools/reverse-exam",
      icon: <RotateCcw className="w-8 h-8 mb-2 text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      title: "Syllabus Sentinel",
      description: "Track progress from your PDF syllabus.",
      href: "/tools/syllabus",
      icon: <ListChecks className="w-8 h-8 mb-2 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Meme-ory Mode",
      description: "Learn concepts through memes.",
      href: "/tools/meme",
      icon: <Smile className="w-8 h-8 mb-2 text-yellow-500" />,
      color: "bg-yellow-50 dark:bg-yellow-950/20"
    },
    {
      title: "Analogy Engine",
      description: "Explain things with your interests.",
      href: "/tools/analogy",
      icon: <LinkIcon className="w-8 h-8 mb-2 text-pink-500" />,
      color: "bg-pink-50 dark:bg-pink-950/20"
    },
    {
      title: "Roast My Code",
      description: "Get sarcastic, fiery feedback on your code.",
      href: "/tools/roast-my-code",
      icon: <Brain className="w-8 h-8 mb-2 text-red-600" />,
      color: "bg-red-50 dark:bg-red-950/20"
    },
    {
      title: "Exam Simulator",
      description: "Practice under pressure with AI exams.",
      href: "/tools/exam-simulator",
      icon: <FileQuestion className="w-8 h-8 mb-2 text-blue-600" />,
      color: "bg-blue-50 dark:bg-blue-950/20"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 relative z-10"
      >
        <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none">
          <Hero3D />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl pt-32 sm:pt-40">
          Padh Lo Yaar <span className="text-primary">AI</span>
        </h1>

        <div className="w-full max-w-3xl mx-auto px-4 py-8">
          <CommandCenter />
        </div>

      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={item} className="h-full">
            <GlassCard className="group h-full flex flex-col justify-between" enableTilt={true}>
              <CardHeader className={`${tool.color} bg-opacity-20 rounded-t-lg pb-4`}>
                {tool.icon}
                <CardTitle className="text-xl">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                <CardDescription className="text-base min-h-[3rem] text-foreground/80">
                  {tool.description}
                </CardDescription>
                <Button asChild className="w-full group-hover:bg-primary/90 shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <Link href={tool.href}>
                    Open Tool <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
