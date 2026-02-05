'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isForgot) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/account/reset`,
                });
                if (error) throw error;
                toast.success("Password reset link sent to your email!");
                setIsForgot(false);
            } else if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                if (data.session) {
                    toast.success("Welcome aboard!");
                    router.push('/');
                    router.refresh();
                } else {
                    toast.success("Check your email for the confirmation link!");
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Welcome back!");
                router.push('/');
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <GlassCard className="w-full max-w-md p-8 relative z-10 space-y-8" enableTilt={false}>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {isForgot ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                    </h1>
                    <p className="text-muted-foreground">
                        {isForgot ? 'Enter your email to receive a reset link.' : (isSignUp ? 'Join the galaxy of learners.' : 'Continue your learning journey.')}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Email"
                                type="email"
                                className="pl-9 bg-black/20 border-white/10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {!isForgot && (
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="pl-9 bg-black/20 border-white/10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {!isSignUp && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsForgot(true)}
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 h-10 font-bold shadow-lg shadow-blue-500/20" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                            <span className="flex items-center">
                                {isForgot ? 'Send Reset Link' : (isSignUp ? 'Sign Up' : 'Log In')} <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    {isForgot ? (
                        <button
                            onClick={() => setIsForgot(false)}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            Back to Log In
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                        </button>
                    )}

                    {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
                        <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-200 text-xs">
                            ⚠️ Demo Mode: Add Supabase keys to env to enable real auth.
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
