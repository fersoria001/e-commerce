"use server";
// src/server-actions/stripeSession.tsx

"use server";

import { Stripe } from "stripe";
import { Envio, Product } from "./types/types";

const apiKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(apiKey);

interface NewSessionOptions {
  products: Product[];
  shipping: Envio;
}

export const postStripeSession = async ({
  products,
  shipping,
}: NewSessionOptions) => {
  const returnUrl =
    "http://localhost:3000/api/checkout-return?session_id={CHECKOUT_SESSION_ID}";
  const lineItems = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const predefined: any[] = products.map((p) => {
      return { price: p.priceId, quantity: p.cantidad! };
    });
    const { direccion, costo, empresa } = shipping;
    const stringAddress = `
    ${direccion?.direccion}, ${direccion?.ciudad}, ${direccion?.provincia}, ${direccion?.pais}. ${direccion?.cp}
    `;
    const newShipping = {
      price_data: {
        currency: "usd",
        product_data: {
          name: `Envio por ${empresa?.nombre}`,
          description: `Envio desde sucursal a ${stringAddress}`,
          images: [empresa?.thumbnail],
        },
        unit_amount_decimal: Math.round((costo || 0) / 10),
      },
      quantity: 1,
    };
    predefined.push(newShipping);
    return predefined;
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

export async function lineItems(stripeSessionId: string): Promise<Product[]> {
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
    expand: ["line_items"],
  });
  const prodPromises = session.line_items?.data.map((li) =>
    stripe.products.retrieve(li.price!.product as string)
  );
  const pricePromises = session.line_items?.data.map((li) =>
    stripe.prices.retrieve(li.price!.id)
  );

  const products = await Promise.all(prodPromises!);
  const prices = await Promise.all(pricePromises!);
  return products.map((product) => {
    const price = prices.find((price) => price.product === product.id);
    return {
      id: product.id,
      categoria: "",
      nombre: product.name,
      imgs: product.images,
      thumbnail: product.images[0],
      descripcion: product.description,
      precio: price?.unit_amount || price?.unit_amount_decimal,
      priceId: price?.id,
      cantidad: product.unit_label ? parseInt(product.unit_label, 10) : 1,
    } as Product;
  });
}
