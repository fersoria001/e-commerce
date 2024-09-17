'use client'
import { Product } from "@/types/types"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
interface Props {
    products: Product[]
}
export function Grid({ products }: Props) {
    const limit = 9
    const pages = Math.round(products.length / limit)
    const [page, setPage] = useState<number>(1)
    const offset = (page - 1) * limit
    function sliceProducts() {
        if (offset + limit > products.length) {
            return products.slice(offset, products.length)
        }
        return products.slice(offset, offset + limit)
    }
    return (
        <div className="flex flex-col py-2 md:px-2">
            <div className="grid grid-cols-1 grid-rows-9 gap-2 mb-2 md:grid-cols-2 md:grid-rows-4 lg:grid-cols-3 lg:grid-rows-3">
                {
                    sliceProducts().map((item) => {
                        return (
                            <Link
                                href={`/producto?id=${item.id}`}
                                key={item.id}
                                className="h-auto border flex flex-col items-center p-5">
                                <Image
                                    src={item.thumbnail}
                                    alt={item.descripcion}
                                    width={120}
                                    height={120}
                                    className="mb-2"
                                />
                                <h1 className="mb-2">{item.nombre}</h1>
                                <p>{item.descripcion}</p>
                                <h2>Precio: ${item.precio}</h2>
                            </Link>)
                    })
                }
            </div>
            <div className="flex self-end p-2">
                <p className="border text-center p-1">{offset}-{offset + limit < products.length ? offset + limit : products.length} de {products.length} productos</p>
                <p
                    className="border text-center p-1"
                    onClick={() => {
                        setPage(p => {
                            if (p > 1) return p - 1
                            return p
                        })
                    }}>
                    {"<"}
                </p>
                {
                    Array.from(Array(pages)).map((_, i) => {
                        const v = i + 1
                        return <p className={clsx("border p-1", {
                            "text-yellow-200": v == page,
                            "text-white": v != page
                        })}
                            key={v}
                            onClick={() => {
                                setPage(v)
                            }}>
                            {v}
                        </p>
                    })
                }
                <p
                    className="border text-center p-1"
                    onClick={() => {
                        setPage(p => {
                            if (p < pages) return p + 1
                            return p
                        })
                    }}>
                    {">"}
                </p>
            </div>
        </div>
    )
}