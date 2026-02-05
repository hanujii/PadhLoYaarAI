'use client';

import { TOOLS } from '@/lib/tools-data';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function ToolsDirectory() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = TOOLS.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                    >
                        Command Center
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 max-w-2xl mx-auto text-lg"
                    >
                        Access 21+ specialized AI agents designed for every aspect of your academic journey.
                    </motion.p>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md mx-auto relative"
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            placeholder="Find a tool..."
                            className="pl-10 bg-zinc-900/50 border-white/10 focus:border-primary/50 h-12 rounded-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>

                {/* Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredTools.map((tool, index) => (
                        <Link key={tool.value} href={tool.href}>
                            <SpotlightCard className="h-full p-8 group border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40" spotlightColor="rgba(139, 92, 246, 0.15)">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 rounded-xl bg-zinc-800/50 group-hover:bg-primary/20 transition-colors duration-300 ring-1 ring-white/5">
                                        <tool.icon className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                        <ArrowRight className="w-4 h-4 text-zinc-300" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-primary transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                                    {tool.description}
                                </p>
                            </SpotlightCard>
                        </Link>
                    ))}
                </motion.div>

                {filteredTools.length === 0 && (
                    <div className="text-center py-20 text-zinc-500">
                        No tools found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}
