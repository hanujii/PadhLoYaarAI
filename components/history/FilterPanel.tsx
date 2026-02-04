'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { TOOLS } from '@/lib/tools-data';

interface FilterPanelProps {
    selectedTools: Set<string>;
    onToggleTool: (tool: string) => void;
    onClearFilters: () => void;
}

export function FilterPanel({ selectedTools, onToggleTool, onClearFilters }: FilterPanelProps) {
    const toolNames = TOOLS.map(t => t.href.replace('/', ''));
    const activeFiltersCount = selectedTools.size;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter by Tool
                    {activeFiltersCount > 0 && (
                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Filter by Tool</span>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs hover:bg-transparent"
                            onClick={(e) => {
                                e.preventDefault();
                                onClearFilters();
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {toolNames.map((tool) => (
                    <DropdownMenuCheckboxItem
                        key={tool}
                        checked={selectedTools.has(tool)}
                        onCheckedChange={() => onToggleTool(tool)}
                        className="capitalize"
                    >
                        {tool.replace(/-/g, ' ')}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
