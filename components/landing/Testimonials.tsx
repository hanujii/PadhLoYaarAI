'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
    {
        name: 'Priya Sharma',
        role: 'Medical Student, AIIMS Delhi',
        avatar: 'PS',
        content: 'The AI Tutor explained complex biochemistry concepts in a way my textbooks never could. My grades improved from B to A+ in just one semester!',
        rating: 5,
        color: 'from-purple-500 to-pink-500',
    },
    {
        name: 'Rahul Verma',
        role: 'JEE Aspirant',
        avatar: 'RV',
        content: 'The exam prep tool is a game-changer. It generates questions exactly like the real JEE pattern. I feel so much more confident now.',
        rating: 5,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Ananya Patel',
        role: 'Computer Science, IIT Bombay',
        avatar: 'AP',
        content: 'Flashcard generator saves me hours of study time. I created 500+ flashcards for my DSA course in just 30 minutes!',
        rating: 5,
        color: 'from-green-500 to-emerald-500',
    },
    {
        name: 'Vikram Singh',
        role: 'UPSC Aspirant',
        avatar: 'VS',
        content: 'The summarizer helped me condense 100-page NCERT chapters into key points. Essential for anyone preparing for competitive exams.',
        rating: 5,
        color: 'from-orange-500 to-yellow-500',
    },
    {
        name: 'Sneha Reddy',
        role: 'MBA Student, ISB',
        avatar: 'SR',
        content: 'I use the case study analyzer for my B-school prep. It breaks down complex business cases in minutes. Absolutely worth it!',
        rating: 5,
        color: 'from-red-500 to-pink-500',
    },
    {
        name: 'Arjun Kumar',
        role: 'Class 12, CBSE',
        avatar: 'AK',
        content: 'The doubt solver is like having a personal tutor available 24/7. It even shows step-by-step solutions for maths problems.',
        rating: 5,
        color: 'from-indigo-500 to-purple-500',
    },
];

export function Testimonials() {
    return (
        <section className="py-24 px-4 overflow-hidden bg-background relative">
            <div className="absolute inset-0 bg-dot-white/[0.1] -z-10" />
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Loved by <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">10,000+ Students</span>
                    </h2>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        See what the community is saying about their AI learning journey.
                    </p>
                </motion.div>
            </div>

            <div className="relative max-w-[100vw] overflow-hidden">
                <div className="flex gap-6 animate-marquee w-max hover:[animation-play-state:paused]">
                    {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, i) => (
                        <div key={i} className="w-[350px] md:w-[450px]">
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                    ))}
                </div>

                {/* Fade edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent z-10" />
            </div>
        </section>
    );
}

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
    return (
        <Card className="p-8 h-full bg-card/80 border border-border backdrop-blur-sm hover:border-primary/30 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-700"}`} />
                ))}
            </div>

            <p className="text-zinc-300 mb-8 leading-relaxed text-lg relative z-10">
                "{testimonial.content}"
            </p>

            <div className="flex items-center gap-4 relative z-10">
                <Avatar className="h-12 w-12 border border-white/10">
                    <AvatarFallback className={`bg-gradient-to-br ${testimonial.color} text-white font-bold`}>
                        {testimonial.avatar}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold text-white text-base">{testimonial.name}</p>
                    <p className="text-xs text-zinc-400">{testimonial.role}</p>
                </div>
                <Quote className="ml-auto w-8 h-8 text-white/10" />
            </div>
        </Card>
    );
}
