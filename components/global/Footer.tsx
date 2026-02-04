import Link from 'next/link';
import { Heart, Github, Coffee, Linkedin } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-white/[0.08] bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Brand & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                                <span className="text-foreground">Study</span>
                                <span className="text-primary">Genie</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            &copy; {currentYear} StudyGenie. All rights reserved.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/tools" className="hover:text-foreground transition-colors">
                            Tools
                        </Link>
                        <Link href="/history" className="hover:text-foreground transition-colors">
                            History
                        </Link>
                        <Link href="/settings" className="hover:text-foreground transition-colors">
                            Settings
                        </Link>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://github.com/hanujii/PadhLoYaarAI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                            title="View on GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/ayush-gupta-creative"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-[#0077b5] transition-all"
                            title="Connect on LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link
                            href="https://buymeacoffee.com/hanujii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all text-sm font-medium"
                            title="Buy me a coffee"
                        >
                            <Coffee className="w-4 h-4" />
                            <span className="hidden sm:inline">Support</span>
                        </Link>
                    </div>
                </div>

                {/* Made with love */}
                <div className="mt-6 pt-6 border-t border-white/[0.05] text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by{' '}
                        <Link
                            href="https://www.linkedin.com/in/ayush-gupta-creative"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-primary transition-colors"
                        >
                            Ayush Gupta
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
