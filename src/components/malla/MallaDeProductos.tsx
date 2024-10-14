'use client'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Producto } from "@/types/types"
import { GenerarEnlacesDePaginacion } from "../pagination/GenerarEnlacesDePaginacion"

export function MallaDeProductos({ productos, paginas }: {
    productos: Producto[],
    paginas: number,
}) {

    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const pagina = parseInt(parametrosDeBusqueda.get("pagina") || "1", 10)

    function generarParametrosDeBusqueda(p: number) {
        const parametros = new URLSearchParams(parametrosDeBusqueda);
        const term = p.toString()
        if (term) {
            parametros.set('pagina', term);
        } else {
            parametros.delete('pagina');
        }

        return `${nombreDeCamino}?${parametros.toString()}`
    }
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (parametrosDeBusqueda.get("pagina")) {
            if (ref.current) {
                ref.current.scrollIntoView({
                    behavior: "instant"
                })
            }
        }
    }, [parametrosDeBusqueda])
    return (
        <div ref={ref} className="flex flex-col py-2 md:px-2 dark:bg-stone-950">
            <div className="grid grid-cols-1 grid-rows-9 gap-2 mb-2 md:grid-cols-2 md:grid-rows-4 lg:grid-cols-3 lg:grid-rows-3">
                {
                    productos.map((item) => {
                        return (
                            <Card
                                key={item._id.toString()}
                                className="h-[200px]">
                                <a href={`/producto?id=${item._id.toString()}`}>
                                    <CardContent className="flex flex-col items-center h-full p-4">
                                        <div className="relative w-[120px] h-[120px] mb-2">
                                            <Image
                                                src={item.imgs[0]}
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
                                                Precio: ${item.precio.precio}
                                            </p>
                                        </div>
                                    </CardContent>
                                </a>
                            </Card>
                        )
                    })
                }
            </div>
            <Pagination className="py-10">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={`?pagina=${pagina - 1}`}
                            className={pagina - 1 <= 0 ? 'pointer-events-none' : ''}
                            aria-disabled={pagina - 1 <= 0}
                            tabIndex={pagina - 1 <= 0 ? -1 : undefined} />
                    </PaginationItem>
                    {
                        GenerarEnlacesDePaginacion(
                            pagina,
                            paginas,
                            generarParametrosDeBusqueda
                        )
                    }
                    <PaginationItem>
                        <PaginationNext
                            href={`?pagina=${pagina + 1}`}
                            className={pagina + 1 > paginas ? 'pointer-events-none' : ''}
                            aria-disabled={pagina + 1 > paginas}
                            tabIndex={pagina + 1 > paginas ? -1 : undefined} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}