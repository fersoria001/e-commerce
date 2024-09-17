'use client'

//import Link from "next/link"
import Image from "next/image"
import { useContext } from "react"
import { CarritoContext } from "./Carrito"
import Link from "next/link"
import { Product } from "@/types/types"

interface Props {
    product: Product
}

export default function CarritoItem({ product }: Props) {
    const { eliminarDelCarrito, actualizarProducto } = useContext(CarritoContext)
    return (
        <div className="w-full flex flex-col py-2 mb-2">
            <Link
                href={`/producto?id=${product.id}`}
                className="flex flex-col mb-4 py-2" >
                <div className="max-w-[160px] max-h-[160px] self-center">
                    <Image
                        src={product.thumbnail}
                        alt={product.nombre}
                        sizes="100vw"
                        width={300}
                        height={300}
                        className="w-full h-auto rounded-3xl object-contain"
                    />
                </div>
                <h1 className="text-center mt-8">
                    {product.nombre}
                </h1>
            </Link>
            <div className="self-start space-x-2 pl-2">
                <label htmlFor="cantidad">
                    Cantidad:
                </label>
                <input
                    id="cantidad"
                    type="number"
                    className="w-10 h-5 text-black rounded-md"
                    min={1}
                    max={500}
                    value={product.cantidad}
                    onChange={(e) => {
                        const p = { ...product, cantidad: parseInt(e.currentTarget.value, 10) }
                        actualizarProducto(p)
                    }} />
            </div>
            <div className="flex self-end pr-2">
                <label
                    htmlFor="precio">
                    Precio: $
                </label>
                <p id="precio"> {product.precio * product.cantidad!} </p>
            </div>
            <button
                className="max-w-fit self-left ml-2 px-7 py-0.5 rounded-lg bg-yellow-300 text-black font-semibold"
                onClick={() => eliminarDelCarrito(product.id)}>
                Quitar
            </button>
        </div>

    )
}