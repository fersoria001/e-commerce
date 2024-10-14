'use client'

import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { Producto } from "@/types/types"
import { Card, CardContent, CardHeader } from "../ui/card"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/navigation"
import { logEvent } from "firebase/analytics"
import { Input } from "../ui/input"
import { ContextoDeFirebase } from "../firebase/ProveedorDeFirebase"
import { ContextoDeCarrito } from "../carrito/ProveedorDeCarrito"
import EsqueletoDeProducto from "./EsqueletoDeProducto"
import { DeslizadorDeImagenes } from "./DeslizadorDeImagenes"


export function TarjetaDeProducto({ elemento }: {
    elemento: Producto
}) {
    const [producto, setProducto] = useState<Producto>({ ...elemento, cantidad: 1 })
    const { analytics } = useContext(ContextoDeFirebase)
    const [imgActiva, setImgActiva] = useState<string>(producto.imgs[0])
    const { agregarAlCarrito, setMostrarCarrito } = useContext(ContextoDeCarrito)
    const { user, isLoading } = useUser()
    const router = useRouter()
    useEffect(() => {
        if (analytics) logEvent(analytics, 'view_item', {
            items: [{
                item_id: producto._id.toString(),
                item_name: producto.nombre,
                item_category: producto.categoria.nombre,
                item_category2: producto.subCategoria.nombre,
                item_list_id: producto.subCategoria._id.toString(),
                price: producto.precio.precio,
            }]
        })
    }, [analytics, producto._id, producto.categoria.nombre, producto.nombre, producto.precio.precio, producto.subCategoria._id, producto.subCategoria.nombre])
    if (isLoading) {
        return <EsqueletoDeProducto />
    }
    return (
        <Card className='flex flex-col md:flex-row border-none shadow-none'>
            <CardHeader className='w-full flex flex-col p-2.5 md:max-w-xs lg:max-w-md xl:max-w-xl self-center'>
                <div className="relative w-full h-[240px] lg:h-[400px] self-center bg-white rounded-3xl overflow-hidden mb-4 border">
                    <Image fill
                        src={imgActiva}
                        alt="Current Image"
                        className="object-contain"
                    />
                </div>
                <DeslizadorDeImagenes imgs={producto.imgs} setImgActiva={(url: string) => setImgActiva(url)} />

            </CardHeader>
            <CardContent className='w-full flex flex-col px-4'>
                <h2 className='text-center text-xl mb-4 p-2'>
                    {producto.nombre}
                </h2>
                <p className=''>
                    {producto.descripcion}
                </p>
                <div className='flex flex-col mt-auto self-end xl:mr-8'>
                    <div className='flex text-xl p-2 space-x-2'>
                        <label htmlFor="precio">Precio:</label>
                        <h3 id="precio" className='font-semibold'>
                            ${producto.precio.precio}
                        </h3>
                    </div>
                    <div className="flex space-x-2 self-end items-center">
                        <div className="flex items-center text-xl p-2 space-x-2">
                            <label htmlFor="cantidad">
                                Cantidad:
                            </label>
                            <Input
                                id="cantidad"
                                type="number"
                                min={1}
                                max={500}
                                value={producto.cantidad}
                                onChange={(e) => {
                                    setProducto(p => { return { ...p, cantidad: parseInt(e.currentTarget.value, 10) } })
                                }}>
                            </Input>
                        </div>
                        <button
                            onClick={() => {
                                if (!user) {
                                    return router.push("/api/auth/login")
                                }
                                if (analytics) logEvent(analytics, 'add_to_cart', {
                                    currency: 'USD',
                                    value: producto.precio.precio * (producto.cantidad || 1),
                                    items: [{
                                        item_id: producto._id.toString(),
                                        item_name: producto.nombre,
                                        item_category: producto.categoria.nombre,
                                        item_category2: producto.subCategoria.nombre,
                                        item_list_id: producto.subCategoria._id.toString(),
                                        price: producto.precio.precio
                                    }]
                                })
                                agregarAlCarrito(producto)
                                setMostrarCarrito(true)
                            }}
                            className='px-2 py-1 text-stone-300 font-semibold bg-red-500 rounded-xl max-w-fit'>
                            Agregar al carrito
                        </button>
                    </div>
                </div>
                <div className='mt-auto mb-4'>
                    <h3 className='mb-4 font-semibold'>Etiquetas:</h3>
                    <span className='flex gap-1'>
                        <p className='max-w-fit text-stone-300 font-semibold px-3 py-2 rounded-md bg-red-500 cursor-default'>
                            {producto.categoria.nombre}
                        </p>
                        <p className='max-w-fit text-stone-300 font-semibold px-3 py-2 rounded-md bg-red-500 cursor-default'>
                            {producto.subCategoria.nombre}
                        </p>
                    </span>
                </div>
            </CardContent>
        </Card>

    )
}