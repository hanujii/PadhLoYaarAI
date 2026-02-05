import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Settings,
    ShieldAlert,
    LogOut,
    Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/');
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r flex flex-col fixed h-full z-20">
                <div className="h-16 flex items-center px-6 border-b">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <ShieldAlert className="w-6 h-6 text-primary" />
                        <span>Admin<span className="text-primary">Panel</span></span>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Back to App
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
