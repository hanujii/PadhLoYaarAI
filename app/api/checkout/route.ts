import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Plan configuration
const PLANS = {
    pro: {
        priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
        name: 'Pro Plan',
    },
    team: {
        priceId: process.env.STRIPE_TEAM_PRICE_ID || 'price_team_monthly',
        name: 'Team Plan',
    },
};

// Lazy initialization to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        return null;
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-01-28.clover',
    });
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const plan = searchParams.get('plan') as keyof typeof PLANS;

    // Validate plan
    if (!plan || !PLANS[plan]) {
        return NextResponse.json(
            { error: 'Invalid plan. Use "pro" or "team".' },
            { status: 400 }
        );
    }

    const stripe = getStripe();

    // Check if Stripe is configured
    if (!stripe) {
        return NextResponse.json(
            { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' },
            { status: 500 }
        );
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PLANS[plan].priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
            // Optional: Pass user email if logged in
            // customer_email: userEmail,
            metadata: {
                plan: plan,
            },
        });

        // Redirect to Stripe Checkout
        return NextResponse.redirect(session.url!, { status: 303 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to create checkout session';
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
