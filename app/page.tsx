'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  GraduationCap,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { CommandCenter } from '@/components/global/CommandCenter';
import { TOOLS } from '@/lib/tools-data';
import { Testimonials } from '@/components/landing/Testimonials';
import { StatsCounter } from '@/components/landing/StatsCounter';
import { FAQSection } from '@/components/landing/FAQSection';

export default function Home() {
  const router = useRouter();

  const handleSearch = (topic: string) => {
    router.push(`/tools/tutor?topic=${encodeURIComponent(topic)}`);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  // Group tools for display
  const featuredTools = TOOLS.slice(0, 6);
  const moreTools = TOOLS.slice(6, 12);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center py-12 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Status Badge */}
          <motion.div variants={fadeIn} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                AI-Powered Learning Platform
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-foreground font-hand">PadhLoYaar</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your intelligent study companion. Master any subject with{' '}
              <span className="text-primary font-semibold">AI-powered</span> tools
              designed for modern students.
            </p>
          </motion.div>

          {/* Command Center */}
          <motion.div
            variants={fadeIn}
            className="w-full max-w-2xl mx-auto pt-4"
          >
            <CommandCenter onChatStart={handleSearch} />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={fadeIn}
            className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span>21+ AI Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Instant Answers</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Always Free</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tools Grid Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl -mt-10 relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful AI Tools
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to ace your studies, from tutoring to exam prep.
          </p>
        </motion.div>

        {/* Featured Tools Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          {featuredTools.map((tool, index) => (
            <motion.div key={tool.value} variants={fadeIn}>
              <Link href={tool.href} className="block group">
                <div className={cn(
                  "glass-card p-6 h-full",
                  "hover:border-primary/30 hover:bg-white/[0.05]",
                  "transition-all duration-300",
                  "card-interactive"
                )}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      "bg-gradient-to-br from-primary/20 to-purple-500/10",
                      "group-hover:from-primary/30 group-hover:to-purple-500/20",
                      "transition-colors duration-300"
                    )}>
                      <tool.icon className="w-6 h-6 text-primary" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* More Tools Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {moreTools.map((tool) => (
            <motion.div key={tool.value} variants={fadeIn}>
              <Link href={tool.href} className="block group">
                <div className={cn(
                  "glass rounded-xl p-4 text-center",
                  "hover:border-primary/30 hover:bg-white/[0.05]",
                  "transition-all duration-300"
                )}>
                  <tool.icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium">{tool.title}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <span>View all {TOOLS.length} tools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Lightbulb,
              title: "Learn Smarter",
              description: "AI explains concepts in ways you understand. Simple, detailed, or ELI5 - your choice."
            },
            {
              icon: GraduationCap,
              title: "Ace Your Exams",
              description: "Generate practice tests, flashcards, and cheat sheets tailored to your syllabus."
            },
            {
              icon: Rocket,
              title: "Study Faster",
              description: "Get instant answers, summaries, and explanations. No more wasting time."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="text-center p-6"
            >
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Social Proof - Stats */}
      <StatsCounter />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQSection />

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 aurora-bg" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to transform your studies?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Start learning smarter today. No signup required.
            </p>
            <Link
              href="/tools/tutor"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                "bg-primary hover:bg-primary/90",
                "text-primary-foreground font-medium",
                "glow-sm hover:glow-md transition-all duration-300"
              )}
            >
              <Sparkles className="w-5 h-5" />
              Start Learning
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}
