/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { createContext, useContext } from "react"
import CarritoItem from "./CarritoItem"
import Link from "next/link"
import { Envio, Product } from "@/types/types"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import clsx from "clsx"
import { ShoppingCartIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

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
    const pathName = usePathname()
    return (
        <Sheet onOpenChange={() => setMostrarCarrito(!mostrarCarrito)} open={mostrarCarrito}>
            <SheetTrigger>
                <ShoppingCartIcon
                    className={clsx("outline-stone-950 w-10 h-10 cursor-pointer hover:outline-stone-950/10", {
                        "hidden": pathName === "/comprar"
                    })} />
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription>
                        {
                            productos.map((p) => <CarritoItem key={p.id} product={p} />)
                        }
                        {
                            productos.length > 0 &&
                            <div>
                                <Separator />
                                <div className="p-2 flex flex-col">
                                    <p className="mb-2">
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
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )

}