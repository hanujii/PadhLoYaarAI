'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const FAQS = [
    {
        question: 'Is PadhLoYaarAI really free?',
        answer: 'Yes! Our free tier gives you 100 AI requests per day, which is plenty for most students. For unlimited access, you can upgrade to Pro.',
    },
    {
        question: 'What subjects can I study with PadhLoYaarAI?',
        answer: 'Any subject! Our AI can help with science, mathematics, history, languages, coding, business, and more. Just ask any question and get instant explanations.',
    },
    {
        question: 'How is this different from ChatGPT?',
        answer: 'PadhLoYaarAI is specifically designed for studying with 21+ specialized tools. We have flashcard generators, exam prep, concept maps, and more - all optimized for learning.',
    },
    {
        question: 'Can I use it for competitive exams like JEE/NEET?',
        answer: 'Absolutely! Many of our users are JEE, NEET, and UPSC aspirants. Our exam prep and practice question tools are designed for competitive exam preparation.',
    },
    {
        question: 'Is my study data private?',
        answer: 'Yes, your data is encrypted and never shared. You can export or delete your data anytime from the Account settings.',
    },
    {
        question: 'Can I use it on mobile?',
        answer: 'Yes! PadhLoYaarAI works great on mobile browsers. You can also install it as an app on Android devices.',
    },
];

export function FAQSection() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Got questions? We've got answers.
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {FAQS.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-base">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                {/* More questions CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center mt-8"
                >
                    <p className="text-muted-foreground">
                        Still have questions?{' '}
                        <a href="/help" className="text-primary hover:underline font-medium">
                            Visit our Help Center
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
