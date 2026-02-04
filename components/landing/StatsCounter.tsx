'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, BookOpen, Sparkles, Trophy } from 'lucide-react';

const STATS = [
    {
        label: 'Active Students',
        value: 10000,
        suffix: '+',
        icon: Users,
        color: 'text-purple-500',
    },
    {
        label: 'Study Sessions',
        value: 50000,
        suffix: '+',
        icon: BookOpen,
        color: 'text-blue-500',
    },
    {
        label: 'AI Responses',
        value: 250000,
        suffix: '+',
        icon: Sparkles,
        color: 'text-green-500',
    },
    {
        label: 'Exams Aced',
        value: 15000,
        suffix: '+',
        icon: Trophy,
        color: 'text-orange-500',
    },
];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    // Format number with commas
    const formatted = count.toLocaleString();

    return (
        <span ref={ref}>
            {formatted}{suffix}
        </span>
    );
}

export function StatsCounter() {
    return (
        <section className="py-16 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-background mb-4 ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold mb-2">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
