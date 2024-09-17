'use client'

import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { ImageSlider } from "./ImageSlider"
import { CarritoContext } from "../carrito/Carrito"
import { Product } from "@/types/types"

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
        <div className='flex flex-col md:flex-row'>
            <div className='w-full flex flex-col p-2.5'>
                <div className="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] mb-8 mx-auto">
                    <Image
                        src={activeImg}
                        alt={item.descripcion}
                        sizes="100vw"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="py-2">
                    <ImageSlider imgs={item.imgs} setActiveImg={(s: string) => setActiveImg(s)} />
                </div>
            </div>
            <article className='w-full flex flex-col px-2 md:w-1/2 shrink-0'>
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
                        className='self-end px-2 py-1 bg-yellow-300 text-black rounded-xl max-w-fit'>
                        Agregar al carrito
                    </button>
                </div>
                <div className='mt-auto mb-4'>
                    <h3 className='mb-4'>Tags:</h3>
                    <span className='flex'>
                        <p className='max-w-fit text-black px-3 py-2 rounded-md bg-yellow-300'>
                            {item.categoria}
                        </p>
                    </span>
                </div>
            </article>
        </div>

    )
}