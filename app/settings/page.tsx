'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Volume2, Trash2, Shield, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const router = useRouter();
    const { user, loading } = useAuth();

    // Redirect logic removed to prevent loops.
    // Instead we render a specific unauthorized state below if not logged in.

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <Shield className="w-16 h-16 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold">Authentication Required</h2>
                <p className="text-muted-foreground max-w-md">
                    Please sign in to access your settings and preferences.
                </p>
                <Button onClick={() => router.push('/login?redirect=/settings')}>
                    Sign In
                </Button>
            </div>
        );
    }

    const handleClearData = () => {
        if (confirm("Are you sure? This will delete your local history and preferences.")) {
            localStorage.clear();
            toast.success("Local data cleared.");
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your preferences and account.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="data">Data & Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6 space-y-4">
                    <Card className="glass-card">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Voice Speed</Label>
                                    <p className="text-sm text-muted-foreground">Adjust playback speed for Jarvis & Podcast.</p>
                                </div>
                                <div className="w-[150px]">
                                    <Slider defaultValue={[1]} max={2} step={0.25} min={0.5} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-6 space-y-4">
                    <Card className="glass-card">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-4">Theme</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" onClick={() => setTheme('light')} className={theme === 'light' ? 'border-primary' : ''}>
                                    <Sun className="mr-2 h-4 w-4" /> Light
                                </Button>
                                <Button variant="outline" onClick={() => setTheme('dark')} className={theme === 'dark' ? 'border-primary' : ''}>
                                    <Moon className="mr-2 h-4 w-4" /> Dark
                                </Button>
                                <Button variant="outline" onClick={() => setTheme('system')} className={theme === 'system' ? 'border-primary' : ''}>
                                    System
                                </Button>
                                <Button variant="outline" onClick={() => setTheme('pitch-black')} className={theme === 'pitch-black' ? 'border-primary' : ''}>
                                    Pitch Black
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="mt-6 space-y-4">
                    <Card className="glass-card border-red-500/20">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base text-red-500">Clear Local Storage</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Delete all saved history, notes, and preferences from this device.
                                    </p>
                                </div>
                                <Button variant="destructive" onClick={handleClearData}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
