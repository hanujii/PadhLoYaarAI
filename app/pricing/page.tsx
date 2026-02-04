import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Pricing',
    description: 'Choose the perfect plan for your learning journey. Free forever with optional Pro features.',
};

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Start free and upgrade when you need more power. No hidden fees, cancel anytime.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Free Plan */}
                <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">✨</span>
                            <h2 className="text-xl font-bold">Free</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">Perfect for casual learners</p>
                    </div>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">₹0</span>
                        <span className="text-muted-foreground"> forever</span>
                    </div>
                    <ul className="space-y-3 mb-6 flex-1">
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Access to all 21+ AI tools</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Basic AI models (Gemini, Groq)</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Save up to 50 items in history</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Standard response speed</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-4 shrink-0 mt-0.5 text-center">–</span>
                            <span>Limited to 100 requests/day</span>
                        </li>
                    </ul>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 w-full h-10 px-5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="relative rounded-2xl border border-primary/50 bg-white/5 backdrop-blur-xl p-6 sm:p-8 flex flex-col shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                            Most Popular
                        </span>
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">⚡</span>
                            <h2 className="text-xl font-bold">Pro</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">For serious students</p>
                    </div>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">₹299</span>
                        <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-3 mb-6 flex-1">
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Everything in Free, plus:</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Unlimited AI requests</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Access to GPT-4 &amp; Claude</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Priority response speed</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Unlimited history storage</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Export to PDF/Markdown</span>
                        </li>
                    </ul>
                    <Link
                        href="/api/checkout?plan=pro"
                        className="inline-flex items-center justify-center gap-2 w-full h-10 px-5 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white text-sm font-medium transition-all"
                    >
                        Upgrade to Pro
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Team Plan */}
                <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">👑</span>
                            <h2 className="text-xl font-bold">Team</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">For study groups &amp; institutions</p>
                    </div>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">₹999</span>
                        <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-3 mb-6 flex-1">
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Everything in Pro, plus:</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Up to 10 team members</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Shared history &amp; flashcards</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Admin dashboard</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Priority support</span>
                        </li>
                    </ul>
                    <Link
                        href="mailto:sales@padhloyaarai.com"
                        className="inline-flex items-center justify-center gap-2 w-full h-10 px-5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                        Contact Sales
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="max-w-2xl mx-auto space-y-4 text-left">
                    <details className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <summary className="font-medium cursor-pointer">Can I cancel anytime?</summary>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Yes! You can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
                        </p>
                    </details>
                    <details className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <summary className="font-medium cursor-pointer">Is there a free trial for Pro?</summary>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We offer a 7-day free trial for Pro. No credit card required to start.
                        </p>
                    </details>
                    <details className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <summary className="font-medium cursor-pointer">What payment methods do you accept?</summary>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We accept all major credit/debit cards, UPI, and net banking through our secure payment partner.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    );
}
