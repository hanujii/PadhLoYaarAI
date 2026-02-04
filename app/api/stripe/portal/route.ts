import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

/**
 * Create Stripe Customer Portal session
 * Allows users to manage their subscription, billing, and payment methods
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user's subscription to find Stripe customer ID
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!subscription?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        // Initialize Stripe
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            return NextResponse.json(
                { error: 'Stripe not configured' },
                { status: 500 }
            );
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2026-01-28.clover',
        });

        // Create portal session
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account`;

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        return NextResponse.json(
            { error: 'Failed to create portal session' },
            { status: 500 }
        );
    }
}
