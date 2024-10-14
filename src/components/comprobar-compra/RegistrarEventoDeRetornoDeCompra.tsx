'use client'
import { useContext, useEffect } from "react";
import Stripe from "stripe";
import { logEvent } from "firebase/analytics";
import { useRouter } from "next/navigation";
import { ContextoDeFirebase } from "../firebase/ProveedorDeFirebase";

export function RegistrarEventoDeRetornoDeCompra({ sesion }: { sesion: Stripe.Checkout.Session }) {
    const { analytics } = useContext(ContextoDeFirebase)
    const router = useRouter()
    useEffect(() => {
        if (analytics && sesion.line_items) {
            const elementos = sesion.line_items.data
                .map((el) => {
                    if (el.price && el.price.product) {
                        const product = el.price.product as Stripe.Product;
                        return {
                            item_id: product.id,
                            item_name: product.name,
                            item_list_id: product.metadata["subCategoria"],
                            price: el.amount_total,
                            quantity: el.quantity || 1
                        };
                    }
                    return undefined;
                })
                .filter((el): el is NonNullable<typeof el> => el !== undefined)
            logEvent(analytics, 'purchase', {
                currency: 'USD',
                value: sesion.line_items.data.reduce((ac, el) => ac + Number(el.amount_total), 0),
                transaction_id: sesion.id,
                shipping: sesion.shipping_cost?.amount_total,
                items: elementos
            })
        }
        router.replace(`/comprobar_compra/exito?id=${sesion.id}`)
    }, [analytics, router, sesion])
    return (
        <div className="h-screen flex elementos-center align-middle">

        </div>
    )
}