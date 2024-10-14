'use client'
import { useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { crearOrdenDeCompraEnStripe, recuperarSesionDeStripe } from "@/lib/actions";
import { logEvent } from "firebase/analytics";
import Stripe from "stripe";
import { ContextoDeFirebase } from "../firebase/ProveedorDeFirebase";
import { ContextoDeCarrito } from "../carrito/ProveedorDeCarrito";
const promesaDeStripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export function Comprar({ secretoDeCliente }: { secretoDeCliente?: string }) {
    const { analytics } = useContext(ContextoDeFirebase)
    const { productos } = useContext(ContextoDeCarrito)
    const obtenerSecretoDeCliente = async () => {
        const stripeResponse = await crearOrdenDeCompraEnStripe({
            productos: productos,
        });
        return stripeResponse.secretoDeCliente;
    };
    let options = {}
    if (secretoDeCliente) {
        options = { clientSecret: secretoDeCliente }
    } else {
        options = { fetchClientSecret: obtenerSecretoDeCliente }
    }
    useEffect(() => {
        const registarInicioDeCompra = async () => {
            if (analytics) {
                if (secretoDeCliente) {
                    const sesion = await recuperarSesionDeStripe({ secretoDeCliente })
                    if (sesion && sesion.line_items) {
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
                            .filter((elemento): elemento is NonNullable<typeof elemento> => elemento !== undefined)
                        logEvent(analytics, 'begin_checkout', {
                            currency: 'USD',
                            value: sesion.line_items.data.reduce((ac, el) => ac + (el.amount_total || 0), 0),
                            items: elementos
                        })
                    }
                }
                else if (productos) {
                    logEvent(analytics, 'begin_checkout', {
                        currency: 'USD',
                        value: productos.reduce((ac, p) => ac + (p.precio.precio * (p.cantidad || 1)), 0),
                        elementos: productos.map((p) => {
                            return {
                                item_id: p._id.toString(),
                                item_name: p.nombre,
                                item_category: p.categoria.nombre,
                                item_category2: p.subCategoria.nombre,
                                item_list_id: p.subCategoria._id.toString(),
                                price: p.precio.precio * (p.cantidad || 1),
                                quantity: (p.cantidad || 1)
                            }
                        })
                    })
                }
            }
        }
        registarInicioDeCompra()
    }, [analytics, secretoDeCliente, productos])
    return (
        <div className="mt-4 px-8">
            <div className="p-3 mb-4 mx-auto w-fit rounded-md border dark:border-stone-800 dark:bg-stone-950 cursor-default">
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
            <div className="rounded-xl overflow-hidden shadow-md">
                <EmbeddedCheckoutProvider stripe={promesaDeStripe} options={options}>
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    )
}