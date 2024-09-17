'use client'
import React, { useCallback, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { postStripeSession } from "@/actions";
import { CarritoContext } from "../carrito/Carrito";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export function Comprar() {
    const { productos } = useContext(CarritoContext)
    const fetchClientSecret = useCallback(async () => {
        const stripeResponse = await postStripeSession({ products: productos });
        return stripeResponse.clientSecret;
    }, [productos]);

    const options = { fetchClientSecret };

    return (
        <div className="mt-24 p-8">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    )
}