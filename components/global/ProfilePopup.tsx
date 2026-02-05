import { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    User,
    History,
    Bookmark,
    Settings,
    LogOut,
    Crown,
    ChevronRight,
    Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthContext';

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    subscription_tier?: string;
    role?: string;
}

export const ProfilePopup = memo(function ProfilePopupComponent() {
    const router = useRouter();
    const { user: authUser, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProfile() {
            if (!authUser) {
                setProfile(null);
                return;
            }

            setIsLoadingProfile(true);
            try {
                // Fetch profile data
                const { data: profileData, error } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url, subscription_tier, role')
                    .eq('id', authUser.id)
                    .single();

                if (error) {
                    console.error("Error fetching profile:", error);
                    // Fallback to basic auth data if profile fetch fails
                    setProfile({
                        id: authUser.id,
                        email: authUser.email || '',
                        full_name: authUser.user_metadata?.full_name,
                        avatar_url: authUser.user_metadata?.avatar_url,
                        subscription_tier: 'free',
                        role: 'user'
                    });
                } else {
                    setProfile({
                        id: authUser.id,
                        email: authUser.email || '',
                        full_name: profileData?.full_name || authUser.user_metadata?.full_name,
                        avatar_url: profileData?.avatar_url || authUser.user_metadata?.avatar_url,
                        subscription_tier: profileData?.subscription_tier || 'free',
                        role: profileData?.role || 'user',
                    });
                }
            } catch (error) {
                console.error('Error in profile fetch:', error);
                setProfile({
                    id: authUser.id,
                    email: authUser.email || '',
                    full_name: authUser.user_metadata?.full_name,
                    avatar_url: authUser.user_metadata?.avatar_url,
                    subscription_tier: 'free',
                    role: 'user'
                });
            } finally {
                setIsLoadingProfile(false);
            }
        }

        fetchProfile();
    }, [authUser]);

    const isLoading = authLoading || (authUser && isLoadingProfile) && !profile;
    const user = profile;

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            toast.success('Signed out successfully');
            router.push('/');
            router.refresh();
        } catch (error) {
            toast.error('Error signing out');
        }
    };

    // Show login button if not authenticated
    if (!isLoading && !user) {
        return (
            <Button
                variant="default"
                size="sm"
                className="rounded-full px-4"
                onClick={() => router.push('/login')}
            >
                Sign In
            </Button>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border animate-pulse">
                <div className="w-8 h-8 rounded-full bg-secondary" />
            </Button>
        );
    }

    const isAdmin = user?.role === 'admin';
    const isPro = user?.subscription_tier === 'pro' || user?.subscription_tier === 'team';
    const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

    const menuItems = [
        { label: 'Profile', href: '/account', icon: User },
        { label: 'History', href: '/history', icon: History },
        { label: 'Saved', href: '/history?tab=saved', icon: Bookmark },
        { label: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full border border-border hover:bg-secondary hover:border-primary/50 transition-all group"
                >
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg group-hover:scale-105 transition-transform",
                        isPro
                            ? "bg-gradient-to-tr from-yellow-500 to-orange-500"
                            : "bg-gradient-to-tr from-primary to-purple-600"
                    )}>
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-xl border-border mt-2">
                {/* User Info Section */}
                <div className="px-2 py-3 border-b border-border mb-2">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                            isPro
                                ? "bg-gradient-to-tr from-yellow-500 to-orange-500"
                                : "bg-gradient-to-tr from-primary to-purple-600"
                        )}>
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Tier Badge */}
                    <div className="mt-3 flex items-center gap-2">
                        <div className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            isPro
                                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                : "bg-secondary text-muted-foreground"
                        )}>
                            {isPro && <Crown className="w-3 h-3" />}
                            {user?.subscription_tier?.toUpperCase() || 'FREE'} Plan
                        </div>
                        {!isPro && (
                            <Link
                                href="/pricing"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                Upgrade <ChevronRight className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                    Quick Access
                </DropdownMenuLabel>

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <DropdownMenuItem key={item.href} asChild className="rounded-lg cursor-pointer">
                            <Link href={item.href} className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                {item.label}
                            </Link>
                        </DropdownMenuItem>
                    );
                })}

                {/* Admin Link */}
                {isAdmin && (
                    <>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-primary">
                            <Link href="/admin" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Admin Panel
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator className="bg-border" />

                {/* Sign Out */}
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
