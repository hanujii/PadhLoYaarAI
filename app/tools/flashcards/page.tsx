'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateFlashcards } from './actions';
import { Loader2, RotateCcw, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadPDFButton } from '@/components/global/DownloadPDFButton';

interface Flashcard {
    front: string;
    back: string;
}

import { useHistoryStore } from '@/lib/history-store';
import { ToolBackButton } from '@/components/global/ToolBackButton';

export default function FlashcardsPage() {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [topic, setTopic] = useState('');
    const cardsRef = useRef<HTMLDivElement>(null);
    const { addToHistory } = useHistoryStore();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setCards([]);
        setCurrentIndex(0);
        setIsFlipped(false);

        const formData = new FormData(event.currentTarget);
        const result = await generateFlashcards(formData);

        setLoading(false);

        if (result.success && result.data) {
            setCards(result.data);
            addToHistory({
                type: 'generation',
                tool: 'Flashcard Genius',
                query: formData.get('topic') as string,
                result: `Generated ${result.data.length} flashcards on ${formData.get('topic')}`
            });
        }
    }

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const flipCard = () => setIsFlipped(!isFlipped);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 min-h-[calc(100vh-8rem)] flex flex-col pb-16 sm:pb-20">
            <div className="w-full">
                <ToolBackButton />
            </div>
            <div className="space-y-2 text-center">
                <h1 className="text-2xl xs:text-3xl sm:text-3xl font-bold flex items-center justify-center gap-2">
                    <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    AI Flashcard Genius
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">Master any topic with AI-generated active recall cards.</p>
            </div>

            {/* Input Section - Only show if no cards or explicitly resetting */}
            {cards.length === 0 && (
                <Card className="max-w-xl mx-auto w-full">
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-lg sm:text-xl">Create a Deck</CardTitle>
                        <CardDescription className="text-sm">Enter a topic, subject, or paste a paragraph.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <Input
                                name="topic"
                                placeholder="e.g. Organic Chemistry Reactions, French Verbs, The Cold War"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                required
                                autoComplete="off"
                                className="h-10 sm:h-11"
                            />
                            <Button type="submit" className="w-full h-10 sm:h-11 touch-target" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Flashcards'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Flashcard Area */}
            {cards.length > 0 && (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 w-full perspective-1000">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50, rotateY: -10 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: -50, rotateY: 10 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-2xl aspect-[4/3] sm:aspect-[3/2] cursor-pointer"
                            onClick={flipCard}
                            style={{ perspective: 1000 }}
                        >
                            <motion.div
                                className="relative w-full h-full text-center transition-all duration-500 transform-style-3d"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Front */}
                                <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center bg-card border-2 shadow-xl rounded-xl p-6 sm:p-8" style={{ backfaceVisibility: 'hidden' }}>
                                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Front</span>
                                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs font-mono text-muted-foreground">{currentIndex + 1} / {cards.length}</span>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground text-center px-4">{cards[currentIndex].front}</h3>
                                    <p className="absolute bottom-3 sm:bottom-4 text-xs text-muted-foreground animate-pulse">Click to flip</p>
                                </div>

                                {/* Back */}
                                <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-primary text-primary-foreground shadow-xl rounded-xl p-6 sm:p-8 overflow-y-auto" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-xs font-bold text-primary-foreground/70 uppercase tracking-widest">Back</span>
                                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs font-mono text-primary-foreground/70">{currentIndex + 1} / {cards.length}</span>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-center px-4">{cards[currentIndex].back}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {/* Controls */}
            {cards.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 mb-3 sm:mb-4">
                    <Button variant="outline" size="icon" onClick={prevCard} title="Previous" className="h-10 w-10 sm:h-11 sm:w-11 touch-target">
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>

                    <Button variant="outline" onClick={() => setCards([])} className="gap-2 h-10 sm:h-11 px-4 sm:px-6">
                        <RotateCcw className="w-4 h-4" /> <span className="hidden xs:inline">New Deck</span>
                    </Button>

                    <div ref={cardsRef} className="hidden">
                        {/* Hidden content for PDF generation if needed later, though flashcards are interactive */}
                        <h1>{topic} Flashcards</h1>
                        {cards.map((c, i) => (
                            <div key={i}>
                                <strong>Q: {c.front}</strong>
                                <p>A: {c.back}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                    {/* Optional PDF download for the whole deck */}
                    <DownloadPDFButton targetRef={cardsRef} filename={`${topic.replace(/\s+/g, '-')}-flashcards.pdf`} variant="outline" buttonText="PDF" className="h-10 sm:h-11" />

                    <Button variant="outline" size="icon" onClick={nextCard} title="Next" className="h-10 w-10 sm:h-11 sm:w-11 touch-target">
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                </div>
            )}
        </div>
    );
}
