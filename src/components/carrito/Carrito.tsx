/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { createContext, useContext } from "react"
import CarritoItem from "./CarritoItem"
import Link from "next/link"
import { Envio, Product } from "@/types/types"

export type CarritoContextType = {
    mostrarCarrito: boolean
    setMostrarCarrito: (v: boolean) => void
    productos: Product[]
    envio: Envio
    agregarEnvio: (e: Envio) => void,
    actualizarProducto: (p: Product) => void,
    agregarAlCarrito: (p: Product) => void
    eliminarDelCarrito: (id: string) => void

}

export const CarritoContext = createContext<CarritoContextType>(
    {
        mostrarCarrito: false,
        setMostrarCarrito: (v: boolean) => { console.log("not implemented yet, create a provider for the context") },
        productos: [],
        envio: {},
        agregarEnvio: (e: Envio) => { console.log("not implemented yet, create a provider for the context") },
        actualizarProducto: (p: Product) => { console.log("not implemented yet, create a provider for the context") },
        agregarAlCarrito: (p: Product) => { console.log("not implemented yet, create a provider for the context") },
        eliminarDelCarrito: (id: string) => { console.log("not implemented yet, create a provider for the context") }
    }
)


export default function Carrito() {
    const { mostrarCarrito, setMostrarCarrito, productos } = useContext(CarritoContext)
    return (
        <div className="fixed right-0 top-0 z-30 w-full md:w-[300px] h-screen bg-background pb-8 overscroll-none">
            <p
                onClick={() => setMostrarCarrito(!mostrarCarrito)}
                className="text-2xl p-3">
                X
            </p>
            <div className="h-full pb-8 overflow-y-auto ">
                {
                    productos.map((p) => <CarritoItem key={p.id} product={p} />)
                }
                {
                    productos.length > 0 &&
                    <div>
                        <div className="h-[1px] w-full bg-yellow-300"></div>
                        <div className="p-2 flex flex-col">
                            <p>
                                Total: ${productos.reduce((acc, obj) => { return acc + (obj.precio * obj.cantidad!) }, 0)}
                            </p>
                            <Link
                                href={"/envios"}
                                onClick={() => setMostrarCarrito(false)}
                                className="max-w-fit self-center px-7 py-0.5 rounded-lg bg-yellow-300 text-black font-semibold">
                                Confirmar compra
                            </Link>
                        </div>
                    </div>
                }
            </div>


        </div>
    )
}