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

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 max-w-4xl pt-4"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            Padh Lo Yaar.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            Your Ultimate AI Study Companion.
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
            {/* 1. AI Tutor - Wide Item */}
            <BentoGridItem
              title="AI Tutor"
              description="Socratic tutoring that adapts to your pace."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-5 border border-white/5 flex-col justify-end relative overflow-hidden group/header">
                  {/* Scrolling Text Marquee */}
                  <div className="absolute top-4 left-0 w-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="flex gap-4 animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-widest text-violet-300">
                      <span>Math • Physics • Coding • History • Writing • Science • Literature • Python • Calculus • Biology •</span>
                      <span>Math • Physics • Coding • History • Writing • Science • Literature • Python • Calculus • Biology •</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

                  {/* Mock Chat UI */}
                  <div className="space-y-3 relative z-10 transition-transform duration-500 group-hover/header:-translate-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">👤</div>
                      <div className="bg-white/5 p-2 rounded-2xl rounded-tl-none text-xs text-zinc-300 max-w-[70%] border border-white/5">
                        Explain recursion?
                      </div>
                    </div>
                    <div className="flex items-start gap-2 flex-row-reverse">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">AI</div>
                      <div className="bg-primary/20 p-2 rounded-2xl rounded-tr-none text-xs text-primary-foreground max-w-[80%] border border-primary/20">
                        It's a function calling itself to solve smaller instances... 🔄
                      </div>
                    </div>
                  </div>
                </div>
              }
              icon={<Brain className="h-4 w-4 text-primary" />}
              className="md:col-span-2"
            />

            {/* 2. Study Roadmaps - Square Item */}
            <BentoGridItem
              title="Study Roadmaps"
              description="A-Z curriculum generation."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 border border-white/5 relative overflow-hidden group/header">
                  {/* Scrolling Text Marquee */}
                  <div className="absolute top-2 left-0 w-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="flex gap-4 animate-marquee whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-blue-300">
                      <span>Syllabus • Curriculum • Planning • Goals • Tracking • Milestones •</span>
                      <span>Syllabus • Curriculum • Planning • Goals • Tracking • Milestones •</span>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />

                  {/* Nodes Visual */}
                  <div className="flex flex-col items-center gap-4 relative z-0 opacity-80 group-hover/header:scale-105 transition-transform">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500/50 bg-blue-500/20 flex items-center justify-center text-xs">1</div>
                    <div className="w-0.5 h-6 bg-blue-500/30" />
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-500/50 bg-cyan-500/20 flex items-center justify-center text-xs">2</div>
                    <div className="w-0.5 h-6 bg-cyan-500/30" />
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center text-xs">3</div>
                  </div>
                </div>
              }
              icon={<Zap className="h-4 w-4 text-blue-400" />}
              className="md:col-span-1"
            />

            {/* 3. Exam Sim - Square Item */}
            <BentoGridItem
              title="Exam Sim"
              description="Mock tests & instant grading."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4 border border-white/5 relative overflow-hidden flex items-center justify-center group/header">
                  {/* Scrolling Text Marquee */}
                  <div className="absolute top-2 left-0 w-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="flex gap-4 animate-marquee whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-orange-300">
                      <span>Quiz • Test • Grade • Feedback • Score • Analysis • Improve •</span>
                      <span>Quiz • Test • Grade • Feedback • Score • Analysis • Improve •</span>
                    </div>
                  </div>
                  {/* Score Card Visual */}
                  <div className="relative z-10 p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm transform rotate-3 group-hover/header:rotate-0 transition-transform duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gradient-gold">A+</div>
                      <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">Score</div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              }
              icon={<GraduationCap className="h-4 w-4 text-orange-400" />}
              className="md:col-span-1"
            />

            {/* 4. Global Knowledge - Wide Item */}
            <BentoGridItem
              title="Global Knowledge"
              description="Real-time web search integration."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-5 border border-white/5 flex-col justify-center relative overflow-hidden group/header">
                  {/* Scrolling Text Marquee */}
                  <div className="absolute top-4 left-0 w-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="flex gap-4 animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-widest text-emerald-300">
                      <span>Sources • Citations • Research • Data • Facts • News • Articles • Papers • Reference •</span>
                      <span>Sources • Citations • Research • Data • Facts • News • Articles • Papers • Reference •</span>
                    </div>
                  </div>

                  {/* Search Bar Visual */}
                  <div className="w-full bg-black/40 border border-white/10 rounded-full h-10 flex items-center px-4 gap-3 backdrop-blur-sm shadow-xl transform group-hover/header:scale-105 transition-transform duration-300">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <div className="h-2 w-24 bg-white/10 rounded-full" />
                  </div>

                  {/* Floating Results */}
                  <div className="absolute top-1/2 right-10 transform -translate-y-1/2 translate-x-12 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-0 transition-all duration-500">
                    <div className="bg-emerald-500/20 px-3 py-1 rounded-full text-[10px] text-emerald-300 border border-emerald-500/20 backdrop-blur-md">
                      2024 Data ⚡
                    </div>
                  </div>
                </div>
              }
              icon={<Globe className="h-4 w-4 text-emerald-400" />}
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
