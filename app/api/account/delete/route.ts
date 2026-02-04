import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

/**
 * Delete user account (GDPR Right to Erasure)
 * Permanently removes all user data and cancels subscriptions
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

        // Parse request body for confirmation
        const body = await request.json();
        if (body.confirmation !== 'DELETE') {
            return NextResponse.json(
                { error: 'Invalid confirmation' },
                { status: 400 }
            );
        }

        // Cancel Stripe subscription if exists
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (stripeSecretKey) {
            const stripe = new Stripe(stripeSecretKey, {
                apiVersion: '2026-01-28.clover',
            });

            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('stripe_subscription_id')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .maybeSingle();

            if (subscription?.stripe_subscription_id) {
                try {
                    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
                } catch (error) {
                    console.error('Failed to cancel Stripe subscription:', error);
                    // Continue with deletion even if Stripe fails
                }
            }
        }

        // Delete all user data (cascading deletes will handle related records)
        // Order matters: Delete from child tables first
        await supabase.from('usage_logs').delete().eq('user_id', user.id);
        await supabase.from('user_history').delete().eq('user_id', user.id);
        await supabase.from('subscriptions').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);

        // Delete auth user (this is the final step)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

        if (deleteError) {
            console.error('Failed to delete auth user:', deleteError);
            throw new Error('Failed to delete account');
        }

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
