'use client'
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useState } from "react";
import Image from "next/image";

interface Props {
    imgs: string[]
    setActiveImg: (s: string) => void
}

export function ImageSlider({ imgs, setActiveImg }: Props) {
    const windowSize = useWindowDimensions()
    const limit = windowSize.width >= 768 ? 4 : 3;
    const pages = Math.round(imgs.length / limit)
    const [page, setPage] = useState<number>(1)
    const offset = (page - 1) * limit
    function sliceArray() {
        if (offset + limit > imgs.length) {
            return imgs.slice(offset, imgs.length)
        }
        return imgs.slice(offset, offset + limit)
    }
    const ctrls = <>
        <div
            className="absolute left-4 inset-y-1/3"
            onClick={() => {
                setPage(p => {
                    if (p > 1) return p - 1
                    return p
                })
            }}>
            {"<"}
        </div>
        <div
            className="absolute right-4 inset-y-1/3"
            onClick={() => {
                setPage(p => {
                    if (p < pages) return p + 1
                    return p
                })
            }}>
            {">"}
        </div>
    </>
    return (
        <div className="relative mb-2 flex">
            {
                imgs.length > limit && ctrls
            }
            <div className="flex mx-auto space-x-2">
                {
                    sliceArray().map((imgUrl, index) =>
                        <div
                            onClick={() => setActiveImg(imgUrl)}
                            key={imgUrl}
                            className="border relative w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]">
                            <Image
                                src={imgUrl}
                                alt={`product image ${index}`}
                                sizes="100vw"
                                fill
                            />
                        </div>
                    )
                }
            </div>


        </div>
    )
}