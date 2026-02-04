import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for PadhLoYaarAI - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <article className="prose dark:prose-invert max-w-none">
                <h1>Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: February 2026</p>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to PadhLoYaarAI ("we," "our," or "us"). We are committed to protecting your privacy
                    and ensuring the security of your personal information. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when you use our AI-powered learning platform.
                </p>

                <h2>2. Information We Collect</h2>
                <h3>2.1 Information You Provide</h3>
                <ul>
                    <li><strong>Account Information:</strong> Email address, name, and password when you create an account.</li>
                    <li><strong>User Content:</strong> Topics you search, questions you ask, and content you generate using our tools.</li>
                    <li><strong>Uploaded Files:</strong> Images or documents you upload for analysis (processed temporarily and not stored permanently).</li>
                </ul>

                <h3>2.2 Automatically Collected Information</h3>
                <ul>
                    <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns.</li>
                    <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                    <li><strong>Cookies:</strong> Session cookies for authentication and preferences.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <ul>
                    <li>To provide and improve our AI learning tools</li>
                    <li>To personalize your learning experience</li>
                    <li>To save your history and preferences (if logged in)</li>
                    <li>To communicate with you about updates and features</li>
                    <li>To analyze usage patterns and improve our service</li>
                </ul>

                <h2>4. Data Sharing</h2>
                <p>We do not sell your personal information. We may share data with:</p>
                <ul>
                    <li><strong>AI Service Providers:</strong> Your queries are sent to AI providers (Google, OpenAI, etc.) to generate responses. These providers have their own privacy policies.</li>
                    <li><strong>Analytics Services:</strong> We use analytics to understand usage patterns (aggregated, anonymized data).</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                </ul>

                <h2>5. Data Security</h2>
                <p>
                    We implement industry-standard security measures including encryption, secure authentication,
                    and regular security audits. However, no method of transmission over the Internet is 100% secure.
                </p>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your data</li>
                    <li>Opt-out of marketing communications</li>
                </ul>

                <h2>7. Children's Privacy</h2>
                <p>
                    Our service is designed for educational purposes and may be used by students of all ages.
                    We do not knowingly collect personal information from children under 13 without parental consent.
                </p>

                <h2>8. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by
                    posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>

                <h2>9. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at:{' '}
                    <a href="mailto:privacy@padhloyaarai.com">privacy@padhloyaarai.com</a>
                </p>
            </article>
        </div>
    );
}
