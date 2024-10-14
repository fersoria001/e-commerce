'use client'
import { createContext, useState } from "react";
import { Producto } from "@/types/types";
import { ObjectId } from "mongodb";


export type TipoDeContextoDeCarrito = {
    mostrarCarrito: boolean
    setMostrarCarrito: (v: boolean) => void
    productos: Producto[]
    agregarAlCarrito: (p: Producto) => void
    eliminarDelCarrito: (id: ObjectId) => void
}
export const ContextoDeCarrito = createContext<TipoDeContextoDeCarrito>(
    {
        mostrarCarrito: false,
        setMostrarCarrito: (v: boolean) => { console.log("not implemented yet, create a provider for the context", v) },
        productos: [],
        agregarAlCarrito: (p: Producto) => { console.log("not implemented yet, create a provider for the context", p) },
        eliminarDelCarrito: (id: ObjectId) => { console.log("not implemented yet, create a provider for the context", id) }
    }
)


export default function ProveedorDeCarrito({ children }: { children: React.ReactNode }) {
    const [mostrarCarrito, setMostrarCarrito] = useState<boolean>(false)
    const [productos, setProductos] = useState<Producto[]>([])
    return (
        <ContextoDeCarrito.Provider value={
            {
                mostrarCarrito: mostrarCarrito,
                setMostrarCarrito: (v) => setMostrarCarrito(v),
                productos: productos,
                agregarAlCarrito: (p: Producto) => {
                    setProductos(prev => {
                        const index = prev.findIndex((elemento) => elemento._id == p._id)
                        if (index >= 0) {
                            return prev.map((elemento, i) => i == index ? { ...elemento, cantidad: (elemento.cantidad || 1) + (p.cantidad || 1) } : elemento)
                        }
                        return [...prev, p]
                    })
                },
                eliminarDelCarrito: (id: ObjectId) => {
                    setProductos(prev => [...prev.filter((elemento) => elemento._id !== id)])
                }
            }
        }>
            {children}
        </ContextoDeCarrito.Provider>
    )
}