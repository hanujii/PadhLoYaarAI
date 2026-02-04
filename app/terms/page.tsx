import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for PadhLoYaarAI - Rules and guidelines for using our platform.',
};

export default function TermsPage() {
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
                <h1>Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: February 2026</p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using PadhLoYaarAI ("the Service"), you agree to be bound by these Terms of Service.
                    If you do not agree to these terms, please do not use our Service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                    PadhLoYaarAI is an AI-powered educational platform that provides learning tools including tutoring,
                    exam preparation, flashcard generation, and other study aids. The Service uses artificial intelligence
                    to generate educational content based on user inputs.
                </p>

                <h2>3. User Responsibilities</h2>
                <h3>3.1 Account Security</h3>
                <p>
                    You are responsible for maintaining the confidentiality of your account credentials and for all
                    activities that occur under your account.
                </p>

                <h3>3.2 Acceptable Use</h3>
                <p>You agree NOT to:</p>
                <ul>
                    <li>Use the Service for any illegal or unauthorized purpose</li>
                    <li>Generate content that is harmful, offensive, or violates others' rights</li>
                    <li>Attempt to bypass rate limits or abuse the API</li>
                    <li>Reverse engineer or attempt to extract source code</li>
                    <li>Use automated scripts to access the Service without permission</li>
                    <li>Share your account with others or create multiple accounts</li>
                </ul>

                <h2>4. AI-Generated Content</h2>
                <h3>4.1 No Guarantee of Accuracy</h3>
                <p>
                    <strong>Important:</strong> AI-generated content may contain errors, inaccuracies, or outdated information.
                    The Service is intended as a learning aid, not a replacement for professional education, textbooks,
                    or expert advice. Always verify important information from authoritative sources.
                </p>

                <h3>4.2 Academic Integrity</h3>
                <p>
                    You are responsible for using the Service in compliance with your institution's academic integrity policies.
                    Submitting AI-generated content as your own work may constitute academic misconduct.
                </p>

                <h2>5. Intellectual Property</h2>
                <h3>5.1 Our Content</h3>
                <p>
                    The Service, including its design, features, and branding, is owned by PadhLoYaarAI and protected
                    by intellectual property laws.
                </p>

                <h3>5.2 Your Content</h3>
                <p>
                    You retain ownership of the content you input. By using the Service, you grant us a license to
                    process your inputs to generate responses. We do not claim ownership of your generated content.
                </p>

                <h2>6. Limitations of Liability</h2>
                <p>
                    THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW,
                    WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM
                    YOUR USE OF THE SERVICE.
                </p>

                <h2>7. Service Availability</h2>
                <p>
                    We strive to maintain high availability but do not guarantee uninterrupted access. We may modify,
                    suspend, or discontinue features at any time without prior notice.
                </p>

                <h2>8. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to the Service at our discretion,
                    particularly if you violate these Terms.
                </p>

                <h2>9. Changes to Terms</h2>
                <p>
                    We may update these Terms from time to time. Continued use of the Service after changes constitutes
                    acceptance of the new Terms.
                </p>

                <h2>10. Governing Law</h2>
                <p>
                    These Terms shall be governed by and construed in accordance with the laws of India,
                    without regard to its conflict of law provisions.
                </p>

                <h2>11. Contact</h2>
                <p>
                    For questions about these Terms, contact us at:{' '}
                    <a href="mailto:legal@padhloyaarai.com">legal@padhloyaarai.com</a>
                </p>
            </article>
        </div>
    );
}
