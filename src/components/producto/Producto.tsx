'use client'

import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { ImageSlider } from "./ImageSlider"
import { CarritoContext } from "../carrito/Carrito"
import { Product } from "@/types/types"
import { Card, CardContent, CardHeader } from "../ui/card"

interface Props {
    item: Product
}
export function Producto({ item }: Props) {
    const [activeImg, setActiveImg] = useState<string>("")
    const { agregarAlCarrito } = useContext(CarritoContext)
    useEffect(() => {
        setActiveImg(item.thumbnail)
    }, [item.thumbnail])
    return (
        <Card className='flex flex-col md:flex-row'>
            <CardHeader className='w-full flex flex-col p-2.5 md:max-w-xs lg:max-w-md xl:max-w-xl self-center'>
                <div className="relative w-full h-[240px] lg:h-[400px] self-center bg-white rounded-3xl overflow-hidden mb-4 border">
                    <Image fill
                        src={activeImg}
                        alt="Current Image"
                        className="object-contain"
                    />
                </div>
                <ImageSlider imgs={item.imgs} setActiveImg={(s: string) => setActiveImg(s)} />

            </CardHeader>
            <CardContent className='w-full flex flex-col px-4'>
                <h2 className='text-center text-xl mb-4 p-2'>
                    {item.nombre}
                </h2>
                <p className=''>
                    {item.descripcion}
                </p>
                <div className='flex flex-col mt-auto self-end xl:mr-8'>
                    <div className='flex text-xl p-2 space-x-2'>
                        <label htmlFor="precio">Precio:</label>
                        <h3 id="precio" className='font-semibold'>${item.precio}</h3>
                    </div>
                    <button
                        onClick={() => agregarAlCarrito(item)}
                        className='self-end px-2 py-1 text-stone-800 font-semibold bg-yellow-300 rounded-xl max-w-fit'>
                        Agregar al carrito
                    </button>
                </div>
                <div className='mt-auto mb-4'>
                    <h3 className='mb-4 font-semibold'>Tags:</h3>
                    <span className='flex'>
                        <p className='max-w-fit text-stone-800 font-semibold px-3 py-2 rounded-md bg-yellow-300 cursor-default'>
                            {item.categoria}
                        </p>
                    </span>
                </div>
            </CardContent>
        </Card>

    )
}