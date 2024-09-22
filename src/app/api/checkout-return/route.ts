// src/app/api/checkout-return/route.ts

import { redirect } from "next/navigation";
import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(apiKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const stripeSessionId = searchParams.get("session_id");

  if (!stripeSessionId?.length) return redirect("/");

  const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

  if (session.status === "complete") {
    // Go to a success page!
    return redirect(`/check-out/success?id=${stripeSessionId}`);
  }

  if (session.status === "open") {
    // Here you'll likely want to head back to some pre-payment page in your checkout
    // so the user can try again
    return redirect(`/check-out`);
  }

  return redirect("/");
}
