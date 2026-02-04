'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    GraduationCap,
    BookOpen,
    FileText,
    BrainCircuit,
    MessageSquare,
    Youtube,
    Calculator,
    Calendar,
    Settings,
    LogOut,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'AI Tutor', href: '/tools/tutor', icon: GraduationCap },
    { title: 'Exam Generator', href: '/tools/exam-generator', icon: FileText },
    { title: 'Study Planner', href: '/tools/roadmap', icon: Calendar }, // Assuming roadmap is planner
    { title: 'Code Helper', href: '/tools/code-transformer', icon: Calculator },
    { title: 'YouTube Notes', href: '/tools/youtube-notes', icon: Youtube },
    { title: 'Flashcards', href: '/tools/flashcards', icon: BookOpen },
    { title: 'Brain Tools', href: '/tools/knowledge-galaxy', icon: BrainCircuit },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-2xl font-hand font-bold tracking-tight">
                    PadhLoYaar<span className="font-sans text-primary">AI</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">Menu</p>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-sidebar-primary" : "opacity-70")} />
                            {item.title}
                        </Link>
                    );
                })}

                <div className="pt-8">
                    <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">More Tools</p>
                    <Link
                        href="/tools/all"
                        // We might need an 'all tools' page, for now link to a generic list or just keep it simple
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200"
                    >
                        <BrainCircuit className="w-5 h-5 opacity-70" />
                        All AI Tools
                    </Link>
                </div>
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Student User</p>
                        <p className="text-xs text-sidebar-foreground/50 truncate">Pro Plan</p>
                    </div>
                    <Settings className="w-4 h-4 text-sidebar-foreground/50 cursor-pointer hover:text-sidebar-foreground" />
                </div>
            </div>
        </div>
    );
}
