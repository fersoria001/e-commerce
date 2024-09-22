'use client'
import { Product } from "@/types/types"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useId, useRef } from "react"
import { useSearchParams } from "next/navigation"

export function Grid({ products, pages, page }: {
    products: Product[],
    pages: number,
    page: number,
}) {
    const searchParams = useSearchParams();
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (searchParams.get("page")) {
            if (ref.current) {
                ref.current.scrollIntoView({
                    behavior: "instant"
                })
            }
        }
    }, [searchParams])
    return (
        <div ref={ref} className="flex flex-col py-2 md:px-2">
            <div className="grid grid-cols-1 grid-rows-9 gap-2 mb-2 md:grid-cols-2 md:grid-rows-4 lg:grid-cols-3 lg:grid-rows-3">
                {
                    products.map((item) => {
                        return (
                            <Card
                                key={item.id}
                                className="h-[200px]">
                                <Link href={`/producto?id=${item.id}`}>
                                    <CardContent className="flex flex-col items-center h-full p-4">
                                        <div className="relative w-[120px] h-[120px] mb-2">
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.descripcion}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-lg font-semibold">
                                                {item.nombre}
                                            </h4>
                                            <p className="text-sm text-stone-600 line-clamp-3">
                                                {item.descripcion}
                                            </p>
                                            <p className="text-lg font-semibold">
                                                Precio: ${item.precio}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        )
                    })
                }
            </div>
            <Pagination className="py-10">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={`?page=${page - 1}`}
                            className={page - 1 <= 0 ? 'pointer-events-none' : ''}
                            aria-disabled={page - 1 <= 0}
                            tabIndex={page - 1 <= 0 ? -1 : undefined} />
                    </PaginationItem>
                    {
                        generatePaginationLinks(
                            page,
                            pages,
                        )
                    }
                    <PaginationItem>
                        <PaginationNext
                            href={`?page=${page + 1}`}
                            className={page + 1 > pages ? 'pointer-events-none' : ''}
                            aria-disabled={page + 1 > pages}
                            tabIndex={page + 1 > pages ? -1 : undefined} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export const generatePaginationLinks = (
    currentPage: number,
    totalPages: number,

) => {
    const pages: JSX.Element[] = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={`?page=${i}`}
                        isActive={i == currentPage}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    } else {
        for (let i = 1; i <= 2; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={`?page=${i}`}
                        isActive={i === currentPage}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        if (2 < currentPage && currentPage < totalPages - 1) {
            pages.push(<PaginationEllipsis />)
            pages.push(
                <PaginationItem key={currentPage}>
                    <PaginationLink
                        href={`?page=${currentPage}`}
                        isActive={true}
                    >
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        pages.push(<PaginationEllipsis />)
        for (let i = totalPages - 1; i <= totalPages; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={`?page=${i}`}
                        isActive={i == currentPage}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    }
    return pages;
};