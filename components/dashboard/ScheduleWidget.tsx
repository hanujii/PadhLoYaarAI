'use client';

import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';

const scheduleItems = [
    { title: "UX/UI Workshop", time: "18:00 - 19:30", chapter: "03 of 20 chapters", active: true },
    { title: "English", time: "11:00 - 12:30", chapter: "18 of 50 chapters", active: false },
    { title: "Product Design", time: "14:00 - 15:30", chapter: "08 of 45 chapters", active: false },
];

export function ScheduleWidget() {
    return (
        <div className="space-y-8">
            {/* Calendar Strip */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">May 2024</h3>
                    <div className="flex gap-2 text-muted-foreground">
                        <span className="cursor-pointer hover:text-foreground">&lt;</span>
                        <span className="cursor-pointer hover:text-foreground">&gt;</span>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-xs text-muted-foreground font-medium uppercase">{d}</div>
                    ))}
                    {/* Dummy Dates */}
                    <div className="py-2 opacity-30">2</div>
                    <div className="py-2 bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/30 font-bold">3</div>
                    <div className="py-2">4</div>
                    <div className="py-2">5</div>
                    <div className="py-2">6</div>
                    <div className="py-2">7</div>
                    <div className="py-2">8</div>
                </div>
            </div>

            {/* Upcoming Classes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Schedule</h3>
                    <span className="text-xs text-primary cursor-pointer hover:underline flex items-center">See all <ChevronRight className="w-3 h-3 ml-1" /></span>
                </div>

                <div className="space-y-3">
                    {scheduleItems.map((item, i) => (
                        <div
                            key={i}
                            className={cn(
                                "p-4 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer",
                                item.active ? "bg-sidebar text-sidebar-foreground shadow-xl shadow-sidebar/20" : "hover:bg-muted/50"
                            )}
                        >
                            <div>
                                <h4 className="font-bold text-sm">{item.title}</h4>
                                <p className={cn("text-xs mt-1", item.active ? "text-sidebar-foreground/60" : "text-muted-foreground")}>
                                    {item.chapter}
                                </p>
                            </div>
                            <div className={cn("text-xs font-medium px-2 py-1 rounded-md", item.active ? "bg-white/10" : "bg-muted")}>
                                {item.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hours Spent Graph Placeholder */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Hours spend</h3>
                    <span className="text-xs text-muted-foreground">22h 40min</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-2 px-2">
                    {[30, 45, 25, 60, 80, 50, 40].map((h, i) => (
                        <div key={i} className={cn("w-full rounded-t-md transition-all hover:opacity-80", i === 4 ? "bg-purple-400" : "bg-muted")} style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
