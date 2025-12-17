'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Hero3D } from '@/components/global/Hero3D';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { CommandCenter } from '@/components/global/CommandCenter';
import { TOOLS } from '@/lib/tools-data';

export default function Home() {
  const router = useRouter();

  const handleSearch = (topic: string) => {
    router.push(`/tools/tutor?topic=${encodeURIComponent(topic)}`);
  };

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

  // Group Tools
  const PREMIUM_TOOLS = ['knowledge-galaxy', 'zen-station', 'podcast', 'jarvis'];
  const STUDY_TOOLS = ['tutor', 'flashcards', 'exam-simulator', 'exam-generator', 'reverse-exam', 'roadmap', 'syllabus', 'teacher-chat'];

  const premium = TOOLS.filter(t => PREMIUM_TOOLS.includes(t.value));
  const study = TOOLS.filter(t => STUDY_TOOLS.includes(t.value));
  const utilities = TOOLS.filter(t => !PREMIUM_TOOLS.includes(t.value) && !STUDY_TOOLS.includes(t.value));

  return (
    <div className="space-y-24 pb-24">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-8 min-h-[600px]">
        <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none overflow-hidden">
          <Hero3D />
        </div>

        <div className="w-full max-w-5xl px-4 z-20 flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            <h1 className="font-extrabold tracking-tighter text-center flex flex-col items-center gap-2">
              <span className="text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
                Padh Lo Yaar
              </span>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500 pb-4 relative">
                AI
                <div className="absolute inset-x-0 -bottom-4 h-[20px] bg-primary/40 blur-2xl rounded-[100%] -z-10" />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
              Your seamless <span className="text-white font-medium">AI study companion</span> for the modern era.
            </p>
          </motion.div>

          <motion.div
            key="command-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full flex flex-col items-center gap-8 relative"
          >
            {/* Glow behind command center */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full scale-150 animate-pulse-slow" />

            <CommandCenter onChatStart={handleSearch} />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ delay: 2, duration: 2, repeat: Infinity }}
              onClick={() => {
                const toolsSection = document.getElementById('featured-section');
                if (toolsSection) {
                  toolsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer mt-12"
            >
              <span className="text-xs font-semibold tracking-widest uppercase opacity-70 group-hover:opacity-100">Explore Tools</span>
              <ArrowRight className="h-5 w-5 rotate-90 opacity-70 group-hover:opacity-100 transition-transform group-hover:translate-y-1" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* --- PREMIUM SECTION --- */}
      <div id="featured-section" className="container mx-auto px-4 max-w-8xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Premium Experience</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {premium.map((tool) => (
            <motion.div key={tool.href} variants={item} className="h-full">
              <Link href={tool.href} className="block h-full group">
                <GlassCard className="h-full flex flex-col justify-between p-8 bg-gradient-to-br from-white/5 to-transparent hover:from-primary/10 transition-all duration-500" enableTilt={true}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${tool.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <tool.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 rounded-full border border-white/10 bg-black/20 group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-300">
                      <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* --- STUDY TOOLS --- */}
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
          <h2 className="text-2xl font-bold tracking-tight">Core Study Tools</h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {study.map((tool) => (
            <ToolCard key={tool.href} tool={tool} variants={item} />
          ))}
        </motion.div>
      </div>

      {/* --- UTILITIES --- */}
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-8 w-1 bg-gradient-to-b from-slate-500 to-gray-500 rounded-full" />
          <h2 className="text-2xl font-bold tracking-tight text-muted-foreground">Utilities & Creative</h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {utilities.map((tool) => (
            <ToolCard key={tool.href} tool={tool} variants={item} compact />
          ))}
        </motion.div>
      </div>

    </div>
  );
}

// Sub-component for standard tool cards
function ToolCard({ tool, variants, compact = false }: { tool: any, variants: any, compact?: boolean }) {
  return (
    <motion.div variants={variants} className="h-full">
      <Link href={tool.href} className="block h-full">
        <GlassCard className={cn(
          "group h-full flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-colors",
          compact ? "p-4" : "p-6"
        )} enableTilt={false}>
          <div className={cn("flex gap-4", compact ? "flex-row items-center" : "flex-col")}>
            <div className={cn(
              "rounded-xl bg-opacity-20 border border-white/10 text-primary group-hover:scale-110 transition-transform duration-300 flex items-center justify-center shrink-0",
              tool.color,
              compact ? "w-10 h-10 p-2" : "w-12 h-12 p-3"
            )}>
              <tool.icon className={cn(compact ? "w-5 h-5" : "w-6 h-6")} />
            </div>
            <div className="space-y-1">
              <h3 className={cn("font-semibold leading-tight tracking-tight", compact ? "text-base" : "text-lg")}>{tool.title}</h3>
              {!compact && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
