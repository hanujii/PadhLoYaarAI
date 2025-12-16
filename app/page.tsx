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
    // Redirect to Tutor tool with the topic
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

  return (
    <div className="space-y-8">

      {/* --- HERO SECTION --- */}
      <div className="relative h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-8">

        {/* Background 3D - Always Visible */}
        <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none overflow-hidden">
          <Hero3D />
        </div>

        {/* Central Content Group: Title + Input */}
        <div className="w-full max-w-4xl px-4 z-20 flex flex-col items-center gap-12">

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className={cn(
              "font-extrabold tracking-tight text-center transition-all duration-500 drop-shadow-2xl flex flex-col items-center gap-2"
            )}>
              <span className="text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60 filter drop-shadow-lg">
                Padh Lo Yaar
              </span>
              <span className="text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse relative">
                AI
                <div className="absolute inset-0 bg-primary/20 blur-xl -z-10 rounded-full"></div>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto">
              Your seamless AI study companion.
            </p>
          </motion.div>

          {/* Interaction Area (Input) */}
          <motion.div
            key="command-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center gap-8"
          >
            <CommandCenter onChatStart={handleSearch} />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ delay: 2, duration: 2, repeat: Infinity }}
              onClick={() => {
                const toolsSection = document.getElementById('tools-section');
                if (toolsSection) {
                  toolsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-muted-foreground hover:text-primary transition-colors p-2 cursor-pointer pointer-events-auto mt-8"
              aria-label="Scroll to tools"
            >
              <span className="text-sm font-medium mb-2 block">Explore Tools</span>
              <ArrowRight className="h-6 w-6 rotate-90 mx-auto" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* --- TOOLS SECTION (Below Fold) --- */}
      <motion.div
        id="tools-section"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-24 px-4 container mx-auto max-w-7xl"
      >
        {TOOLS.map((tool) => (
          <motion.div key={tool.href} variants={item} className="h-full">
            <Link href={tool.href} className="block h-full">
              <GlassCard className="group h-full flex flex-col justify-between p-6 cursor-pointer hover:border-primary/50 transition-colors" enableTilt={false}>
                <div className="flex-1 flex flex-col gap-4">
                  <div className={`p-3 w-fit rounded-xl bg-opacity-20 ${tool.color} text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white/10`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-1 tracking-tight">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[4.5rem]">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Usage available</span>
                  <ArrowRight className="w-4 h-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
