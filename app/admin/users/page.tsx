import { createClient } from '@/lib/supabase/server';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function UsersPage() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        return <div>Error loading users</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <div className="text-muted-foreground text-sm">
                    Showing latest 50 users
                </div>
            </div>

            <div className="border rounded-lg bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>XP</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} />
                                        <AvatarFallback>{user.full_name?.substring(0, 2) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.full_name || 'Unknown'}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                                        {user.role || 'user'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.subscription_tier === 'pro' ? 'default' : 'secondary'}>
                                        {user.subscription_tier}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                    {user.xp?.toLocaleString()} XP
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {user.created_at && formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
