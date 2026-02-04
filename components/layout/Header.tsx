'use client';

import { Bell, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AIModelSelector } from '@/components/global/AIModelSelector';
import { useState } from 'react';

export function Header() {
    const [model, setModel] = useState<string | 'auto'>('auto');

    return (
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6 gap-4 sticky top-0 z-50">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for courses, tools..."
                        className="pl-9 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
                <AIModelSelector value={model} onValueChange={setModel} className="hidden sm:block" />

                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </Button>

                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground md:hidden">
                    <Settings className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}
