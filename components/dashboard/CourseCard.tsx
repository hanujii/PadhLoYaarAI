'use client';

import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CourseCardProps {
    title: string;
    description: string;
    tags: string[];
    rating: number;
    ratingCount: number;
    startDate: string;
    bgVariant: 'mint' | 'purple' | 'orange' | 'blue';
    href: string;
}

export function CourseCard({ title, description, tags, rating, ratingCount, startDate, bgVariant, href }: CourseCardProps) {

    // Map variants to specific classes/images
    const bgMap = {
        mint: "bg-[#D1FAE5] dark:bg-emerald-950/30",
        purple: "bg-[#E9D5FF] dark:bg-purple-950/30",
        orange: "bg-[#FFEDD5] dark:bg-orange-950/30",
        blue: "bg-[#DBEAFE] dark:bg-blue-950/30"
    };

    const textMap = {
        mint: "text-emerald-800 dark:text-emerald-200",
        purple: "text-purple-800 dark:text-purple-200",
        orange: "text-orange-800 dark:text-orange-200",
        blue: "text-blue-800 dark:text-blue-200"
    };

    // We can use the generated abstract images as background textures if present, 
    // but for now, clean solids/gradients are safer and match the reference well.
    // The reference has subtle vector art.

    return (
        <div className={cn("rounded-[2rem] p-6 lg:p-8 relative overflow-hidden transition-transform hover:scale-[1.01] duration-300", bgMap[bgVariant])}>
            {/* Background Decor (Subtle Circles) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between h-full">
                <div className="flex-1 space-y-4">
                    {/* Start Date */}
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span>Start {startDate}</span>
                    </div>

                    <h3 className={cn("text-2xl md:text-3xl font-bold leading-tight text-foreground")}>
                        {title}
                    </h3>

                    <p className="text-foreground/70 max-w-md text-sm md:text-base leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {tags.map(tag => (
                            <span key={tag} className="bg-white/50 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-6">
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500 font-bold justify-end">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{rating}</span>
                        </div>
                        <p className="text-xs opacity-50 mt-1">{ratingCount.toLocaleString()} rating</p>
                    </div>

                    <Button variant="outline" className="rounded-full h-12 px-6 border-white/20 bg-white/40 dark:bg-black/20 hover:bg-white/60 backdrop-blur-md group">
                        Start <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
