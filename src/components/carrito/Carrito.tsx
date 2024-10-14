/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useContext } from "react"
import Link from "next/link"
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
import { logEvent } from "firebase/analytics"
import { ContextoDeFirebase } from "../firebase/ProveedorDeFirebase"
import { ContextoDeCarrito } from "./ProveedorDeCarrito"
import ElementoDeCarrito from "./ElementoDeCarrito"



export default function Carrito() {
    const { analytics } = useContext(ContextoDeFirebase)
    const { mostrarCarrito, setMostrarCarrito, productos } = useContext(ContextoDeCarrito)
    const nombreDeCamino = usePathname()
    return (
        <Sheet onOpenChange={() => {
            if (analytics) logEvent(analytics, 'view_cart', {
                currency: 'USD',
                value: productos.reduce((acc, p) => acc + (p.precio.precio * (p.cantidad || 1)), 0),
                items: productos.map((p) => {
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
            setMostrarCarrito(!mostrarCarrito)
        }} open={mostrarCarrito}>
            <SheetTrigger >
                <ShoppingCartIcon
                    className={clsx("outline-stone-950 w-10 h-10 cursor-pointer hover:outline-stone-950/10", {
                        "hidden": nombreDeCamino === "/comprar"
                    })} />
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription>
                        {
                            productos.map((p) => <ElementoDeCarrito key={p._id.toString()} producto={p} />)
                        }
                        {
                            productos.length > 0 &&
                            <div>
                                <Separator />
                                <div className="p-2 flex flex-col">
                                    <p className="mb-2">
                                        Total: ${productos.reduce((ac, obj) => { return ac + (obj.precio.precio * obj.cantidad!) }, 0)}
                                    </p>
                                    <Link
                                        href={"/comprar"}
                                        onClick={() => setMostrarCarrito(false)}
                                        className="max-w-fit self-center px-7 py-0.5 rounded-lg bg-red-500 text-stone-300 font-semibold">
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