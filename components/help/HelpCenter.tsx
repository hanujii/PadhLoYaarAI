'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    BookOpen,
    CreditCard,
    Settings,
    MessageCircle,
    Mail,
    HelpCircle,
    Sparkles,
    Send,
    CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const FAQ_CATEGORIES = {
    general: {
        icon: HelpCircle,
        title: 'General',
        faqs: [
            {
                question: 'What is PadhLoYaarAI?',
                answer: 'PadhLoYaarAI is an AI-powered learning platform with 21+ tools designed to help students study smarter. From AI tutoring to flashcard generation, exam prep to code learning - we provide comprehensive study assistance.',
            },
            {
                question: 'Is PadhLoYaarAI free to use?',
                answer: 'Yes! We offer a generous free tier with 100 AI requests per day. For unlimited access and premium features, you can upgrade to our Pro plan.',
            },
            {
                question: 'Which AI models do you use?',
                answer: 'We use state-of-the-art AI models including Google Gemini, GPT-4, and Groq. You can choose your preferred model in the settings.',
            },
            {
                question: 'Is my data safe?',
                answer: 'Absolutely. We use industry-standard encryption and never share your data with third parties. Your study history is private and secure.',
            },
        ],
    },
    tools: {
        icon: Sparkles,
        title: 'AI Tools',
        faqs: [
            {
                question: 'How does the AI Tutor work?',
                answer: 'The AI Tutor uses advanced language models to answer your questions, explain concepts, and guide you through problems step-by-step. Just type your question and get instant help!',
            },
            {
                question: 'Can I upload PDFs and documents?',
                answer: 'Yes! Our PDF Explainer tool lets you upload documents and ask questions about the content. Perfect for understanding textbooks and research papers.',
            },
            {
                question: 'How accurate are the AI-generated flashcards?',
                answer: 'Our flashcard generator creates high-quality cards based on your input. We recommend reviewing them before studying to ensure accuracy for your specific course.',
            },
            {
                question: 'Can I export my study materials?',
                answer: 'Yes! You can export flashcards, summaries, and other content as PDF, Markdown, or plain text from the History page.',
            },
        ],
    },
    billing: {
        icon: CreditCard,
        title: 'Billing',
        faqs: [
            {
                question: 'How do I upgrade to Pro?',
                answer: 'Visit the Pricing page and click "Upgrade to Pro". You\'ll be redirected to our secure payment page powered by Stripe.',
            },
            {
                question: 'Can I cancel my subscription?',
                answer: 'Yes, you can cancel anytime from your Account page. You\'ll continue to have access until the end of your billing period.',
            },
            {
                question: 'Do you offer student discounts?',
                answer: 'Yes! Email us from your university email address for a special student discount on Pro plans.',
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit/debit cards, UPI, and net banking through our payment partner Stripe.',
            },
        ],
    },
    account: {
        icon: Settings,
        title: 'Account',
        faqs: [
            {
                question: 'How do I reset my password?',
                answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a link to reset your password.',
            },
            {
                question: 'Can I change my email address?',
                answer: 'Currently, email changes require contacting support. We\'re working on adding this feature to the Account settings.',
            },
            {
                question: 'How do I delete my account?',
                answer: 'Go to Account > Danger Zone > Delete Account. Note: This action is permanent and cannot be undone.',
            },
            {
                question: 'What is XP and how does it work?',
                answer: 'XP (Experience Points) is our gamification system. You earn XP by using tools, maintaining streaks, and completing study sessions. Level up to unlock achievements!',
            },
        ],
    },
};

const QUICK_LINKS = [
    { title: 'Getting Started Guide', href: '/help/getting-started', icon: BookOpen },
    { title: 'AI Tools Overview', href: '/help/tools', icon: Sparkles },
    { title: 'Pricing & Plans', href: '/pricing', icon: CreditCard },
    { title: 'Contact Support', href: '#contact', icon: MessageCircle },
];

export function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Filter FAQs based on search
    const filteredFaqs = searchQuery
        ? Object.entries(FAQ_CATEGORIES).reduce((acc, [key, category]) => {
            const matchingFaqs = category.faqs.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matchingFaqs.length > 0) {
                acc[key as keyof typeof FAQ_CATEGORIES] = { ...category, faqs: matchingFaqs };
            }
            return acc;
        }, {} as typeof FAQ_CATEGORIES)
        : FAQ_CATEGORIES;

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);
        toast.success('Message sent! We\'ll get back to you within 24 hours.');
    };

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
                <p className="text-muted-foreground text-lg mb-8">
                    Search our help center or browse by category below.
                </p>

                {/* Search */}
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search for help..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 text-lg"
                    />
                </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
                {QUICK_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                        <a
                            key={link.title}
                            href={link.href}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-muted transition-colors text-center"
                        >
                            <Icon className="w-6 h-6 text-primary" />
                            <span className="font-medium text-sm">{link.title}</span>
                        </a>
                    );
                })}
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16"
            >
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
                        {Object.entries(FAQ_CATEGORIES).map(([key, category]) => {
                            const Icon = category.icon;
                            return (
                                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {category.title}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {Object.entries(filteredFaqs).map(([key, category]) => (
                        <TabsContent key={key} value={key}>
                            <Accordion type="single" collapsible className="w-full">
                                {category.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </TabsContent>
                    ))}
                </Tabs>

                {searchQuery && Object.keys(filteredFaqs).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No results found for "{searchQuery}"</p>
                        <Button variant="link" onClick={() => setSearchQuery('')}>
                            Clear search
                        </Button>
                    </div>
                )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
                id="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Contact Support
                        </CardTitle>
                        <CardDescription>
                            Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {submitted ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground mb-4">
                                    We've received your message and will respond within 24 hours.
                                </p>
                                <Button variant="outline" onClick={() => setSubmitted(false)}>
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Name</label>
                                        <Input
                                            required
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Email</label>
                                        <Input
                                            type="email"
                                            required
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Message</label>
                                    <Textarea
                                        required
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        placeholder="Describe your issue or question..."
                                        rows={5}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
