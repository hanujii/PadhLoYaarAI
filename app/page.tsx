'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Hero3D } from '@/components/global/Hero3D';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DashboardChat } from '@/components/dashboard/DashboardChat';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopicTyper } from '@/components/global/TopicTyper';
import { TOPICS } from '@/lib/topics';
import { CommandCenter } from '@/components/global/CommandCenter';

import { TOOLS } from '@/lib/tools-data';

export default function Home() {
  const [chatTopic, setChatTopic] = useState<string | null>(null);

  // No need to redeclare tools, we use TOOLS directly from lib

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

        <h1 className={cn(
          "font-extrabold tracking-tight pt-24 sm:pt-32 md:pt-40 px-4 transition-all duration-500",
          chatTopic ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl"
        )}>
          Padh Lo Yaar <span className="text-primary">AI</span>
        </h1>

        <div className="w-full max-w-3xl mx-auto px-4 py-8">
          <CommandCenter onChatStart={setChatTopic} />
        </div>

      </motion.div>

      {chatTopic ? (
        <DashboardChat initialTopic={chatTopic} onReset={() => setChatTopic(null)} />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {TOOLS.map((tool) => (
            <motion.div key={tool.href} variants={item} className="h-full">
              <Link href={tool.href} className="block h-full">
                <GlassCard className="group h-full flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-colors" enableTilt={false}>
                  <CardHeader className={`${tool.color} bg-opacity-20 rounded-t-lg pb-4`}>
                    <tool.icon className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                    <CardDescription className="text-base min-h-[3rem] text-foreground/80">
                      {tool.description}
                    </CardDescription>
                    <div className="w-full flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Tool <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
