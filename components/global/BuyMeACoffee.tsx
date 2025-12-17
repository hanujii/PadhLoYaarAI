'use client';

import React from 'react';
import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export const BuyMeACoffee = () => {
    // Replace 'your-username' with your actual Buy Me a Coffee username
    const username = 'hanujii';

    return (
        <motion.a
            href={`https://buymeacoffee.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#FFDD00] text-black font-bold rounded-full shadow-lg hover:bg-[#FFDD00]/90 transition-colors"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Coffee className="w-5 h-5" />
            <span className="hidden sm:inline">Buy me a coffee</span>
        </motion.a>
    );
};
