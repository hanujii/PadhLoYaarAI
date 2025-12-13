'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopicTyper } from '@/components/global/TopicTyper';
import { TOPICS } from '@/lib/topics';

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
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Padh Lo Yaar <span className="text-primary">AI</span>
        </h1>
        <div className="text-lg text-muted-foreground max-w-2xl mx-auto min-h-[3rem] flex items-center justify-center">
          <span className="mr-2">I want to learn about</span>
          <TopicTyper
            topics={TOPICS}
            className="font-semibold text-primary underline decoration-dotted underline-offset-4"
          />
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={item}>
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 h-full">
              <CardHeader className={`${tool.color} rounded-t-lg pb-4`}>
                {tool.icon}
                <CardTitle className="text-xl">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <CardDescription className="text-base min-h-[3rem]">
                  {tool.description}
                </CardDescription>
                <Button asChild className="w-full group-hover:bg-primary/90">
                  <Link href={tool.href}>
                    Open Tool <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
