import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        return null;
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-01-28.clover',
    });
}

/**
 * Get Supabase admin client for webhook operations
 * Uses service role key to bypass RLS policies
 */
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('Supabase not configured for webhooks. Skipping database updates.');
        return null;
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

export async function POST(request: NextRequest) {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    // Check configuration
    if (!stripe || !webhookSecret) {
        console.error('Stripe webhook not configured');
        return NextResponse.json(
            { error: 'Webhook not configured' },
            { status: 500 }
        );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Webhook signature verification failed:', message);
        return NextResponse.json(
            { error: `Webhook Error: ${message}` },
            { status: 400 }
        );
    }

    const supabase = getSupabaseAdmin();

    // Handle specific events
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log('✅ Checkout completed:', session.id);

            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan || 'pro';

            if (!userId) {
                console.error('No userId in session metadata');
                break;
            }

            if (supabase) {
                try {
                    // Create subscription record
                    const { error: subError } = await supabase
                        .from('subscriptions')
                        .upsert({
                            user_id: userId,
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_id: session.subscription as string,
                            status: 'active',
                            plan_id: plan,
                            current_period_start: new Date().toISOString(),
                            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                            cancel_at_period_end: false,
                            updated_at: new Date().toISOString(),
                        });

                    if (subError) throw subError;

                    // Update user profile tier
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .update({
                            subscription_tier: plan,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', userId);

                    if (profileError) throw profileError;

                    console.log(`✅ User ${userId} upgraded to ${plan}`);
                } catch (error) {
                    console.error('Failed to update subscription in database:', error);
                }
            }

            break;
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object as any; // Stripe.Subscription with extended props
            console.log('🔄 Subscription updated:', subscription.id);

            if (supabase) {
                try {
                    // Get user by stripe subscription ID
                    const { data: existingSub } = await supabase
                        .from('subscriptions')
                        .select('user_id, plan_id')
                        .eq('stripe_subscription_id', subscription.id)
                        .single();

                    if (!existingSub) {
                        console.warn('Subscription not found in database');
                        break;
                    }

                    // Update subscription status
                    const { error: updateError } = await supabase
                        .from('subscriptions')
                        .update({
                            status: subscription.status,
                            current_period_start: subscription.current_period_start
                                ? new Date(subscription.current_period_start * 1000).toISOString()
                                : new Date().toISOString(),
                            current_period_end: subscription.current_period_end
                                ? new Date(subscription.current_period_end * 1000).toISOString()
                                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            cancel_at_period_end: subscription.cancel_at_period_end || false,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('stripe_subscription_id', subscription.id);

                    if (updateError) throw updateError;

                    // If subscription is no longer active, downgrade user
                    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .update({
                                subscription_tier: 'free',
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', existingSub.user_id);

                        if (profileError) throw profileError;
                        console.log(`⬇️ User ${existingSub.user_id} downgraded to free (status: ${subscription.status})`);
                    }
                } catch (error) {
                    console.error('Failed to update subscription:', error);
                }
            }

            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log('❌ Subscription cancelled:', subscription.id);

            if (supabase) {
                try {
                    // Get user by stripe subscription ID
                    const { data: existingSub } = await supabase
                        .from('subscriptions')
                        .select('user_id')
                        .eq('stripe_subscription_id', subscription.id)
                        .single();

                    if (!existingSub) {
                        console.warn('Subscription not found in database');
                        break;
                    }

                    // Mark subscription as deleted
                    const { error: subError } = await supabase
                        .from('subscriptions')
                        .update({
                            status: 'canceled',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('stripe_subscription_id', subscription.id);

                    if (subError) throw subError;

                    // Revoke premium access
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .update({
                            subscription_tier: 'free',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', existingSub.user_id);

                    if (profileError) throw profileError;

                    console.log(`❌ User ${existingSub.user_id} access revoked`);
                } catch (error) {
                    console.error('Failed to handle subscription deletion:', error);
                }
            }

            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as any; // Stripe.Invoice with extended props
            console.log('⚠️ Payment failed:', invoice.id);

            // Check if invoice has subscription (can be string or Subscription object)
            const subscriptionId = typeof invoice.subscription === 'string'
                ? invoice.subscription
                : invoice.subscription?.id;

            if (supabase && subscriptionId) {
                try {
                    // Get user by stripe subscription ID
                    const { data: existingSub } = await supabase
                        .from('subscriptions')
                        .select('user_id')
                        .eq('stripe_subscription_id', subscriptionId)
                        .single();

                    if (existingSub) {
                        // Update subscription status to past_due
                        await supabase
                            .from('subscriptions')
                            .update({
                                status: 'past_due',
                                updated_at: new Date().toISOString(),
                            })
                            .eq('stripe_subscription_id', subscriptionId);

                        console.log(`⚠️ User ${existingSub.user_id} payment failed - marked as past_due`);

                        // TODO: Send email notification to user
                        // This would integrate with your email service (Resend, SendGrid, etc.)
                        // await sendPaymentFailedEmail(existingSub.user_id, invoice.hosted_invoice_url);
                    }
                } catch (error) {
                    console.error('Failed to handle payment failure:', error);
                }
            }

            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
