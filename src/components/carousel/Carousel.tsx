'use client'

import { Product } from "@/types/types"
import { CarouselItem } from "./CarouselItem"

import { useWindowDimensions } from "@/hooks/useWindowDimensions"
import { useEffect, useMemo,  useState } from "react"

interface Props {
    products: Product[]
}
export function Carousel({ products }: Props) {
    const windowSize = useWindowDimensions()
    const limit = windowSize.width >= 768 ? 2 : 1;
    const pages = Math.round(products.length / limit)
    const [page, setPage] = useState<number>(1)
    const slicedArray = useMemo(() => {
        const offset = (page - 1) * limit
        if (offset + limit > products.length) {
            return products.slice(offset, products.length)
        }
        return products.slice(offset, offset + limit)
    }, [limit, page, products])

    useEffect(() => {
        function pollDOM() {
            return setPage(p => {
                if (p < limit) return p + 1
                return 1
            })
        }
        const interval = setInterval(pollDOM, 5000);
        return () => clearInterval(interval);
    }, [limit])
    return (
        <div className="border-b relative mb-2">
            <div
                className="absolute left-4 bottom-1/2"
                onClick={() => setPage(p => {
                    if (p > 1) return p - 1
                    return pages
                })}>
                {"<"}
            </div>
            <div
                className="absolute right-4 bottom-1/2"
                onClick={() => setPage(p => {
                    if (p < pages) return p + 1
                    return 1
                })}>
                {">"}
            </div>
            <div className="flex px-12">
                {
                    slicedArray.map((p) =>
                        <CarouselItem
                            key={p.id}
                            product={p} />)
                }
            </div>
        </div>
    )
}