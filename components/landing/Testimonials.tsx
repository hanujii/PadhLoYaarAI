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
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Loved by <span className="text-primary">10,000+</span> Students
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Join thousands of students who are already studying smarter with AI.
                        </p>
                    </motion.div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full hover:shadow-lg transition-shadow relative overflow-hidden group">
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                                {/* Quote icon */}
                                <Quote className="absolute top-4 right-4 w-8 h-8 text-muted-foreground/20" />

                                {/* Content */}
                                <div className="relative">
                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Review text */}
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback className={`bg-gradient-to-r ${testimonial.color} text-white`}>
                                                {testimonial.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
