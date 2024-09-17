'use client'

import { Product } from "@/types/types"
import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { ItemSugerencias } from "./ItemSugerencias"
import { useState } from "react"

interface Props {
    products: Product[]
}
export function Sugerencias({ products }: Props) {
    const windowSize = useWindowDimensions()
    const limit = windowSize.width > 1024 ? 5 : windowSize.width >= 768 ? 3 : 1;
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
        <div className="relative mb-2 h-[320px]">
            <div
                className="absolute left-4 bottom-1/2"
                onClick={() => {
                    setPage(p => {
                        if (p > 1) return p - 1
                        return p
                    })
                }}>
                {"<"}
            </div>
            <div
                className="absolute right-4 bottom-1/2"
                onClick={() => {
                    setPage(p => {
                        if (p < pages) return p + 1
                        return p
                    })
                }}>
                {">"}
            </div>
            <div className="flex px-12">
                {
                    sliceProducts().map((p) =>
                        <ItemSugerencias
                            key={p.id}
                            product={p} />
                    )
                }
            </div>


        </div>
    )
}