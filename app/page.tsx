'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  GraduationCap,
  Code,
  Globe,
  CheckCircle2,
  Users
} from 'lucide-react';
import { CommandCenter } from '@/components/global/CommandCenter';
import { TOOLS } from '@/lib/tools-data';
import { Testimonials } from '@/components/landing/Testimonials';
import { StatsCounter } from '@/components/landing/StatsCounter';
import { FAQSection } from '@/components/landing/FAQSection';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

export default function Home() {
  const router = useRouter();

  const handleSearch = (topic: string) => {
    router.push(`/tools/tutor?topic=${encodeURIComponent(topic)}`);
  };

  const featuredTools = TOOLS.slice(0, 6);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden bg-background text-foreground selection:bg-primary/20">

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs font-medium text-muted-foreground"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          v2.0 Now Live
        </motion.div>

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Master any subject with <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AI Superpowers.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your all-in-one AI study companion. Tutoring, Flashcards, Roadmaps, and more.
            <span className="block sm:inline font-semibold text-foreground"> Always Free.</span>
          </p>
        </motion.div>

        {/* Command Center */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl z-10"
        >
          <CommandCenter onChatStart={handleSearch} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-2"
        >
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none glow-sm btn-glow">
              Get Started for Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border border-background flex items-center justify-center text-[10px]">
                  <Users className="w-3 h-3 text-zinc-400" />
                </div>
              ))}
            </div>
            <span>10k+ Students</span>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid (Clean) */}
      <section className="py-24 bg-secondary/20 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-bold">Why PadhLoYaar?</h2>
            <p className="text-muted-foreground">Everything you need to ace your exams.</p>
          </div>

          <BentoGrid>
            <BentoGridItem
              title="AI Tutor"
              description="Instant explanations tailored to your learning style."
              header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20" />}
              icon={<Brain className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Study Roadmaps"
              description="Custom curriculum generation."
              header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />}
              icon={<Zap className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-1"
            />
            <BentoGridItem
              title="Exam Sim"
              description="Mock tests with real-time scoring."
              header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20" />}
              icon={<GraduationCap className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-1"
            />
            <BentoGridItem
              title="Global Knowledge"
              description="Access real-time web search for research."
              header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20" />}
              icon={<Globe className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-2"
            />
          </BentoGrid>
        </div>
      </section>

      {/* Tools List */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Explore Content</h2>
            <p className="text-muted-foreground mt-2">Pick a tool to start learning.</p>
          </div>
          <Link href="/tools">
            <Button variant="outline" className="rounded-full">View All Tools</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
            <Link key={tool.value} href={tool.href} className="group">
              <div className="h-full p-6 rounded-2xl border border-border bg-card/50 hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors", tool.color.split(' ')[0], "bg-opacity-20")}>
                  <tool.icon className={cn("w-6 h-6", tool.color.split(' ')[1])} />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <StatsCounter />
      <Testimonials />
      <FAQSection />

      {/* Footer CTA */}
      <section className="py-24 bg-primary/5 border-y border-primary/10 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to learn smarter?</h2>
          <p className="text-muted-foreground text-lg">Join thousands of students using PadhLoYaarAI today.</p>
          <Link href="/login">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
