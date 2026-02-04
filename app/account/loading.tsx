import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function AccountLoading() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <Skeleton className="h-10 w-64 mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Card Skeleton */}
                    <Card className="p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-64" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                        <Skeleton className="h-3 w-full" />
                    </Card>

                    {/* Usage Stats Skeleton */}
                    <Card className="p-6">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Subscription Card Skeleton */}
                    <Card className="p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-2 mb-6">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </Card>

                    {/* Danger Zone Skeleton */}
                    <Card className="p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
