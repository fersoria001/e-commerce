'use client'
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { Product } from "@/types/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";



export function Receipt({ receipt }: { receipt: Product[] }) {
    const [mostrarDetalles, setMostrarDetalles] = useState<boolean>(false)
    const { width } = useWindowDimensions()
    const calcularSubTotal = () => receipt.reduce((acc, obj) => acc + obj.precio, 0)
    const firstImage = (img: string) => {
        if (!img.startsWith("/")) {
            return `/${img}`
        }
        return img
    }
    return (
        <div className="flex flex-col rounded-3xl w-full max-w-sm mx-auto lg:max-w-lg border border-stone-350 h-screen">
            {
                receipt.length > 1 ?
                    <>
                        <div className={clsx("flex mt-6 py-6 ml-4", {
                            "hidden": mostrarDetalles || width > 768
                        })}>
                            <div className="max-w-[40px] max-h-[40px] mr-4">
                                <Image
                                    src={firstImage(receipt[0].thumbnail)}
                                    alt={receipt[0].nombre}
                                    sizes="100vw"
                                    width={300}
                                    height={300}
                                    className="w-full h-auto rounded-3xl"
                                />
                            </div>
                            <div>
                                <h1 className="text-left font-semibold text-sm text-stone-400 pb-1">
                                    Subtotal
                                </h1>
                                <h1 className="text-left text-2xl font-semibold text-white pb-1">
                                    ${calcularSubTotal()}
                                </h1>
                                <button
                                    onClick={() => setMostrarDetalles(true)}
                                    className="flex bg-stone-800 rounded-3xl py-3 px-2.5">
                                    <p className="font-semibold text-sm">Ver detalles</p>
                                    <p className="ml-2 text-sm">V</p>
                                </button>
                            </div>
                        </div>
                        <div className={clsx("px-4 transition-all duration-500 ease-in-out", {
                            "max-h-0 invisible": width <= 768 && !mostrarDetalles,
                            "max-h-[500px] flex flex-col overflow-y-auto pb-8 mt-10": width <= 768 && mostrarDetalles,
                            "max-h-[500px] flex flex-col overflow-y-auto py-8 max-w-lg px-8": width > 768
                        })}>
                            <div className="mb-4">
                                <h1 className="text-left font-semibold text-sm text-stone-400 pb-1">Total</h1>
                                <h1 className="text-left text-3xl text-white pb-1 lg:text-4xl lg:pb-0">${calcularSubTotal()}</h1>
                            </div>
                            {
                                receipt.map((p) => {
                                    return (
                                        <div className="flex mb-6 w-full" key={p.id}>
                                            <div className="max-w-[40px] max-h-[40px] mr-4">
                                                <Image
                                                    src={firstImage(p.thumbnail)}
                                                    alt={p.descripcion}
                                                    sizes="100vw"
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-auto rounded-3xl"
                                                />
                                            </div>
                                            <div className="mt-2 w-full lg:mt-auto">
                                                <div className="flex justify-between">
                                                    <h1 className="text-sm font-semibold text-white">{p.nombre}</h1>
                                                    <h1 className="text-sm font-bold text-white">${p.precio}</h1>
                                                </div>
                                                <h2 className="text-left text-xs text-stone-400">{p.descripcion}</h2>
                                            </div>

                                        </div>

                                    )
                                })
                            }
                            <div className={clsx("ml-[50px]", {
                                "block": width <= 768,
                                "hidden": width > 768
                            })}>
                                <div className="h-[0.5px] bg-gray-200 mb-4"></div>
                                <div className="flex justify-between mb-12 font-semibold text-sm">
                                    <label>Total:</label>
                                    <p>${calcularSubTotal()}</p>
                                </div>
                                <button
                                    onClick={() => setMostrarDetalles(false)}
                                    className="flex bg-stone-900 rounded-3xl py-3 px-2.5 max-w-fit">
                                    <p className="font-semibold text-sm">Ocultar detalles</p>
                                    <p className="ml-2 text-sm">^</p>
                                </button>
                            </div>
                        </div>
                    </>
                    :
                    <div className="flex flex-col items-center py-6 px-4 lg:px-[4.5rem]">
                        {
                            receipt.map((p) => {
                                return (
                                    <div className="flex lg:flex-col-reverse" key={p.id}>
                                        <div className="max-w-[40px] max-h-[40px] mt-2 mr-4 lg:max-w-[250px] lg:max-h-[250px]">
                                            <Image
                                                src={firstImage(p.thumbnail)}
                                                alt={p.nombre}
                                                sizes="100vw"
                                                width={300}
                                                height={300}
                                                className="w-full h-auto rounded-3xl"
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-left font-semibold text-md text-stone-400 pb-1">{p.nombre}</h1>
                                            <h1 className="text-left text-3xl text-white pb-1">${p.precio}</h1>
                                            <h2 className="text-left font-semibold text-sm text-stone-400">{p.descripcion}</h2>
                                        </div>
                                    </div>

                                )
                            })
                        }

                    </div>
            }
            <Link 
            href={"/"}
            className="max-w-fit self-center px-7 py-0.5 rounded-lg bg-yellow-300 text-black font-semibold">
                Continuar
            </Link>
        </div>
    )
}