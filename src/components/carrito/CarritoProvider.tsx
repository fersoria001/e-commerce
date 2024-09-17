'use client'
import { useState } from "react";
import { CarritoContext } from "./Carrito";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { Envio, Product } from "@/types/types";

export default function CarritoProvider({ children }: { children: React.ReactNode }) {
    const [mostrarCarrito, setMostrarCarrito] = useState<boolean>(false)
    const [productos, setProductos] = useState<Product[]>([])
    const [envio, setEnvio] = useState<Envio>({})
    const { user, error, isLoading } = useUser()
    const router = useRouter()
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    return (
        <CarritoContext.Provider value={
            {
                mostrarCarrito: mostrarCarrito,
                setMostrarCarrito: (v) => setMostrarCarrito(v),
                productos: productos,
                envio: envio,
                agregarEnvio: (e: Envio) => {
                    setEnvio(e)
                },
                agregarAlCarrito: (p: Product) => {
                    setProductos(prev => {
                        const index = prev.findIndex((item) => item.id == p.id)
                        if (index >= 0) {
                            return prev.map((item, i) => i == index ? { ...item, cantidad: item.cantidad!++ } : item)
                        }
                        return [...prev, { ...p, cantidad: 1 }]
                    })
                    if (user) {
                        setMostrarCarrito(true)
                        return
                    }
                    return router.push("/api/auth/login")
                },
                actualizarProducto: (p: Product) => {
                    setProductos(prev => prev.map((item) => item.id === p.id ? p : item))
                },
                eliminarDelCarrito: (id: string) => {
                    setProductos(prev => [...prev.filter((item) => item.id !== id)])
                    setMostrarCarrito(true)
                }
            }
        }>
            {children}
        </CarritoContext.Provider>
    )
}