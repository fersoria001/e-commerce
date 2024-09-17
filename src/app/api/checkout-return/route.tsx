// src/app/checkout-return/route.ts

import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(apiKey);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (request: NextRequest, response: NextResponse) => {
    const { searchParams } = new URL(request.url);

    const stripeSessionId = searchParams.get("session_id");

    if (!stripeSessionId)
        return redirect("/");

    const checkoutSession = await stripe.checkout.sessions.retrieve(stripeSessionId, {
        expand: ['line_items'],
    });

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be peformed
    if (checkoutSession.payment_status !== 'unpaid') {
        // TODO: Perform fulfillment of the line items

        // TODO: Record/save fulfillment status for this
        // Checkout Session
    }

    if (checkoutSession.status === "complete") {
        // Go to a success page!
        return redirect(
            `/check-out/success`,
        );
    }

    if (checkoutSession.status === "open") {
        // Here you'll likely want to head back to some pre-payment page in your checkout 
        // so the user can try again
        return redirect(
            `/comprar`,
        );
    }

    return redirect("/");
};