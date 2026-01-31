'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard, GlassCardSimple } from '@/components/ui/glass-card';
import { Hero3D } from '@/components/global/Hero3D';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles, BookOpen, BrainCircuit, GraduationCap, Mic, Code, Trophy, LayoutGrid, Zap } from 'lucide-react';
import { CommandCenter } from '@/components/global/CommandCenter';
import { TOOLS } from '@/lib/tools-data';
import { ShimmerText } from '@/components/ui/shimmer-text';

export default function Home() {
  const router = useRouter();

  const handleSearch = (topic: string) => {
    router.push(`/tools/tutor?topic=${encodeURIComponent(topic)}`);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Group Tools for Bento Grid
  const FEATURED_TOOL = TOOLS.find(t => t.value === 'knowledge-galaxy');
  const SECONDARY_TOOLS = TOOLS.filter(t => ['zen-station', 'podcast'].includes(t.value));
  const QUICK_TOOLS = TOOLS.filter(t => !['knowledge-galaxy', 'zen-station', 'podcast'].includes(t.value)).slice(0, 6);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center py-20 px-4">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Hero3D />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        <div className="w-full max-w-5xl z-10 flex flex-col items-center gap-10 mt-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="text-center space-y-6"
          >
            {/* New Badge Design */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-sm font-medium text-foreground/80 shadow-lg">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>v2.0 Now Live</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-extrabold tracking-tight text-center flex flex-col items-center gap-2">
              <span className="text-5xl sm:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-2xl">
                Padh Lo Yaar
              </span>
              <ShimmerText className="text-6xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-r from-primary via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                AI
              </ShimmerText>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your intelligent study companion. Master any subject with <span className="text-primary font-semibold">AI-powered</span> tools designed for the modern student.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-2xl relative"
          >
            <CommandCenter onChatStart={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* --- BENTO GRID DASHBOARD --- */}
      <section id="dashboard" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-20 relative z-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]"
        >

          {/* Header Tile */}
          <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-end pb-2">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-primary" />
              Your Dashboard
            </h2>
            <p className="text-muted-foreground">Access your premium tools and recent study aids.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="hidden lg:block lg:col-span-2 row-span-1" />

          {/* LARGE FEATURED CARD (Knowledge Galaxy) */}
          {FEATURED_TOOL && (
            <motion.div variants={fadeInUp} className="md:col-span-2 row-span-2 h-full">
              <Link href={FEATURED_TOOL.href} className="block h-full">
                <GlassCard
                  className="h-full group hover:border-primary/50"
                  variant="elevated"
                  spotlight={true}
                >
                  <div className="h-full flex flex-col justify-between p-8 relative">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                      <FEATURED_TOOL.icon className="w-32 h-32 text-primary rotate-12" />
                    </div>

                    <div className="bg-primary/20 w-fit p-3 rounded-xl backdrop-blur-md border border-primary/20">
                      <FEATURED_TOOL.icon className="w-8 h-8 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">{FEATURED_TOOL.title}</h3>
                      <p className="text-muted-foreground text-lg">{FEATURED_TOOL.description}</p>
                    </div>

                    <div className="absolute bottom-8 right-8 bg-white/10 p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          )}

          {/* SECONDARY TOOLS (Zen, Podcast) */}
          {SECONDARY_TOOLS.map((tool) => (
            <motion.div key={tool.value} variants={fadeInUp} className="md:col-span-1 row-span-1 h-full">
              <Link href={tool.href} className="block h-full">
                <GlassCard className="h-full flex flex-col justify-between p-6 group hover:border-purple-500/50">
                  <div className="flex justify-between items-start">
                    <div className={cn("p-2 rounded-lg bg-white/5", tool.color)}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <Zap className="w-4 h-4 text-muted-foreground opacity-50" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-purple-400 transition-colors">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}

          {/* QUICK ACCESS GRID (Smaller Tools) */}
          {QUICK_TOOLS.map((tool) => (
            <motion.div key={tool.value} variants={fadeInUp} className="md:col-span-1 row-span-1 h-full">
              <Link href={tool.href} className="block h-full">
                <GlassCardSimple className="h-full p-5 flex flex-col gap-3 group hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <tool.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-sm">{tool.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
                    {tool.description}
                  </p>
                </GlassCardSimple>
              </Link>
            </motion.div>
          ))}

          {/* Explore More CTA */}
          <motion.div variants={fadeInUp} className="md:col-span-1 row-span-1 h-full flex items-center justify-center">
            <Link href="/tools" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
              <div className="w-12 h-12 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest">View All</span>
            </Link>
          </motion.div>

        </motion.div>
      </section>

      {/* --- FOOTER DECORATION --- */}
      <div className="fixed bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
    </div>
  );
}
