'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function ToolBackButton() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
        >
            <Link href="/#tools-section">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Tools
                </Button>
            </Link>
        </motion.div>
    );
}
