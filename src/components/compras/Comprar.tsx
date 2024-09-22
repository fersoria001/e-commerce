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
    const { productos, envio } = useContext(CarritoContext)
    const fetchClientSecret = useCallback(async () => {
        const stripeResponse = await postStripeSession({ products: productos, shipping: envio });
        return stripeResponse.clientSecret;
    }, [productos, envio]);

    const options = { fetchClientSecret };

    return (
        <div className="mt-4 px-8">
            <div className="bg-yellow-300 p-3 mb-4 text-black rounded-lg">
                <h3 className="w-full text-center underline">
                    Este es un modo de prueba, podes user las siguientes tarjetas
                    de prueba para completar la compra:
                </h3>
                <ul className="list-inside list-disc">
                    <li>
                        Tarjeta con fondos: 4242424242424242
                    </li>
                    <li>
                        Pago rechazado: 4000000000009995
                    </li>
                </ul>
                <h3>
                    Usa como fecha de vencimiento, cualquier fecha futura al dia de hoy.
                </h3>
                <h3>
                    Usa para los demas campos del formulario (CVC, nombre, país o región ) cualquier valor.
                </h3>
            </div>
            <div className="">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    )
}