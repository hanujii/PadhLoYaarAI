import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, Code, FileQuestion, FileText, Brain, MessageSquare, Image, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const tools = [
    {
      title: "Tutor Tool",
      description: "Get step-by-step explanations for any topic.",
      href: "/tools/tutor",
      icon: <BookOpen className="w-8 h-8 mb-2 text-primary" />,
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
      icon: <FileQuestion className="w-8 h-8 mb-2 text-orange-600" />,
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
      icon: <Brain className="w-8 h-8 mb-2 text-purple-600" />,
      color: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Teacher Chat",
      description: "Conversational voice practice.",
      href: "/tools/teacher-chat",
      icon: <MessageSquare className="w-8 h-8 mb-2 text-yellow-600" />,
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
      icon: <Database className="w-8 h-8 mb-2 text-cyan-600" />,
      color: "bg-cyan-50 dark:bg-cyan-950/20"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Padh Lo Yaar <span className="text-primary">AI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your all-in-one AI study companion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Card key={tool.href} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
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
        ))}
      </div>
    </div>
  );
}
