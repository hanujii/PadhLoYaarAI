import type { Metadata } from 'next';
import { HelpCenter } from '@/components/help/HelpCenter';

export const metadata: Metadata = {
    title: 'Help Center',
    description: 'Get help with PadhLoYaarAI. Find answers to common questions, tutorials, and contact support.',
};

export default function HelpPage() {
    return <HelpCenter />;
}
