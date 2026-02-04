'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Users, ArrowRight, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SubscriptionCardProps {
    subscription: {
        plan_id: string;
        status: string;
        current_period_end: string;
        cancel_at_period_end: boolean;
    } | null;
    tier: string;
}

export function SubscriptionCard({ subscription, tier }: SubscriptionCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const plans = {
        free: {
            name: 'Free',
            icon: Check,
            color: 'text-gray-500',
            benefits: [
                '100 requests per day',
                'All 21 AI tools',
                'Basic support',
            ],
        },
        pro: {
            name: 'Pro',
            icon: Crown,
            color: 'text-purple-500',
            benefits: [
                'Unlimited requests',
                'All 21 AI tools',
                'Priority support',
                'Advanced features',
                'No ads',
            ],
        },
        team: {
            name: 'Team',
            icon: Users,
            color: 'text-blue-500',
            benefits: [
                'Unlimited requests',
                'All features',
                'Team management',
                'Dedicated support',
                'Custom integrations',
            ],
        },
    };

    const currentPlan = plans[tier as keyof typeof plans] || plans.free;
    const Icon = currentPlan.icon;

    const renewalDate = subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
            month: 'long',
            Day: 'numeric',
            year: 'numeric'
        })
        : null;

    const handleManageBilling = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
            });

            if (response.ok) {
                const { url } = await response.json();
                window.location.href = url;
            } else {
                alert('Failed to open billing portal');
            }
        } catch (error) {
            console.error('Error opening portal:', error);
            alert('Failed to open billing portal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-secondary ${currentPlan.color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{currentPlan.name} Plan</h3>
                        {subscription && (
                            <p className="text-sm text-muted-foreground">
                                {subscription.cancel_at_period_end ? (
                                    <span className="text-orange-500">Cancels on {renewalDate}</span>
                                ) : (
                                    <>Renews on {renewalDate}</>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {subscription && (
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscription.status}
                    </Badge>
                )}
            </div>

            <div className="space-y-2 mb-6">
                {currentPlan.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{benefit}</span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                {tier === 'free' ? (
                    <Button
                        className="flex-1"
                        onClick={() => router.push('/pricing')}
                    >
                        Upgrade to Pro
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleManageBilling}
                        disabled={loading}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        {loading ? 'Loading...' : 'Manage Billing'}
                    </Button>
                )}
            </div>
        </Card>
    );
}
