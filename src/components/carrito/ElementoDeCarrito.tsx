'use client'
import Image from "next/image"
import { useContext } from "react"
import Link from "next/link"
import { Producto } from "@/types/types"
import { logEvent } from "firebase/analytics"
import { ContextoDeFirebase } from "../firebase/ProveedorDeFirebase"
import { ContextoDeCarrito } from "./ProveedorDeCarrito"


export default function ElementoDeCarrito({ producto }: {
    producto: Producto
}) {
    const { analytics } = useContext(ContextoDeFirebase)
    const { eliminarDelCarrito } = useContext(ContextoDeCarrito)
    return (
        <div className="w-full flex flex-col py-2 mb-2">
            <Link
                href={`/producto?id=${producto._id.toString()}`}
                className="flex flex-col mb-4 py-2" >
                <div className="max-w-[160px] max-h-[160px] self-center">
                    <Image
                        src={producto.imgs[0]}
                        alt={producto.nombre}
                        sizes="100vw"
                        width={300}
                        height={300}
                        className="w-full h-auto rounded-3xl object-contain"
                    />
                </div>
                <h1 className="text-center mt-8">
                    {producto.nombre}
                </h1>
            </Link>
            <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                    <label htmlFor="cantidad">
                        Cantidad:
                    </label>
                    <p>{producto.cantidad}</p>
                </div>
                <div className="flex">
                    <label
                        htmlFor="precio">
                        Precio: $
                    </label>
                    <p id="precio"> {producto.precio.precio * producto.cantidad!} </p>
                </div>
            </div>
            <button
                className="max-w-fit px-7 py-0.5 rounded-lg bg-red-500 text-stone-300 font-semibold"
                onClick={() => {
                    if (analytics) logEvent(analytics, 'remove_from_cart', {
                        currency: 'USD',
                        value: producto.precio.precio * (producto.cantidad || 1),
                        items: [{
                            item_id: producto._id.toString(),
                            item_name: producto.nombre,
                            item_category: producto.categoria.nombre,
                            item_category2: producto.subCategoria.nombre,
                            item_list_id: producto.subCategoria._id.toString(),
                            price: producto.precio.precio,
                        }]
                    })
                    eliminarDelCarrito(producto._id)
                }}>
                Quitar
            </button>
        </div>

    )
}