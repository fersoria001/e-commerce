"use server";
// src/server-actions/stripeSession.tsx

"use server";

import { Stripe } from "stripe";
import { Product } from "./types/types";

const apiKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(apiKey);

interface NewSessionOptions {
  products: Product[];
}

export const postStripeSession = async ({ products }: NewSessionOptions) => {
  const returnUrl =
    "http://localhost:3000/checkout-return?session_id={CHECKOUT_SESSION_ID}";
  const lineItems = () => {
    return products.map((p) => {
      return { price: p.priceId, quantity: p.cantidad! };
    });
  };
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: lineItems(),
    mode: "payment",
    return_url: returnUrl,
  });

  if (!session.client_secret)
    throw new Error("Error initiating Stripe session");

  return {
    clientSecret: session.client_secret,
  };
};
