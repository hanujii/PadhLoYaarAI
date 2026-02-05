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
  Lightbulb,
  Rocket,
  Code
} from 'lucide-react';
import { CommandCenter } from '@/components/global/CommandCenter';
import { TOOLS } from '@/lib/tools-data';
import { Testimonials } from '@/components/landing/Testimonials';
import { StatsCounter } from '@/components/landing/StatsCounter';
import { FAQSection } from '@/components/landing/FAQSection';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';

export default function Home() {
  const router = useRouter();

  const handleSearch = (topic: string) => {
    router.push(`/tools/tutor?topic=${encodeURIComponent(topic)}`);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const featuredTools = TOOLS.slice(0, 6);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden bg-black selection:bg-primary/30">

      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-grid opacity-[0.1]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
      </div>

      {/* HERO SECTION */}
      <HeroHighlight containerClassName="h-[90vh] sm:h-screen">
        <main className="flex flex-col items-center justify-center p-4 text-center z-10 w-full max-w-5xl mx-auto space-y-6 sm:space-y-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.3)] backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            v2.0 Now Live
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white max-w-4xl leading-[0.9] sm:leading-tight"
          >
            Master Any Subject with
            <br />
            <Highlight className="text-white">AI Superpowers</Highlight>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base xs:text-lg sm:text-xl md:text-2xl text-muted-foreground/80 max-w-2xl font-medium"
          >
            Your all-in-one AI study companion.
            <br className="hidden sm:block" />
            Tutor, Exam Prep, Flashcards, and more — <span className="text-white font-semibold">100% Free.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-6"
          >
            <MagneticButton>
              <Link href="#tools">
                <Button size="lg" className="h-12 sm:h-14 px-8 rounded-full text-base sm:text-lg bg-white text-black hover:bg-white/90 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </MagneticButton>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[10px] text-white font-bold">
                    {['A', 'S', 'R', 'M'][i - 1]}
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="text-white font-bold">10,000+</span> students</p>
            </div>
          </motion.div>

          {/* Command Center Mockup */}
          <CommandCenter onChatStart={handleSearch} />

        </main>
      </HeroHighlight>

      {/* Bento Grid Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why PadhLoYaar?</h2>
          <p className="text-zinc-400">Engineered for peak academic performance.</p>
        </div>

        <BentoGrid>
          <BentoGridItem
            title="AI Tutor"
            description="Personalized explanations that adapt to your learning style."
            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />}
            icon={<Brain className="h-4 w-4 text-neutral-500" />}
            className="md:col-span-2"
          />
          <BentoGridItem
            title="Roadmaps"
            description="Generate improved study plans instantly."
            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />}
            icon={<Zap className="h-4 w-4 text-neutral-500" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Code Reviews"
            description="Paste code and get instant optimization tips."
            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20" />}
            icon={<Code className="h-4 w-4 text-neutral-500" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Exam Simulator"
            description="Real-time mock tests with instant feedback."
            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-900/20 to-red-900/20" />}
            icon={<GraduationCap className="h-4 w-4 text-neutral-500" />}
            className="md:col-span-2"
          />
        </BentoGrid>
      </section>

      {/* Spotlight Tools Grid */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Core Tools</h2>
          <p className="text-zinc-400">Select a tool to begin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featuredTools.map((tool) => (
            <Link key={tool.value} href={tool.href}>
              <SpotlightCard className="h-full p-8 group">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <tool.icon className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-100">{tool.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{tool.description}</p>
                <ArrowRight className="absolute bottom-8 right-8 w-5 h-5 text-zinc-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </SpotlightCard>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/tools">
            <MagneticButton className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-sm transition-colors">
              View All Tools ({TOOLS.length})
            </MagneticButton>
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <StatsCounter />
      <Testimonials />
      <FAQSection />

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl font-bold tracking-tight">Ready to excel?</h2>
            <Link href="/tools/tutor">
              <MagneticButton className="px-10 py-5 bg-primary text-white text-xl font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Get Started for Free
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

