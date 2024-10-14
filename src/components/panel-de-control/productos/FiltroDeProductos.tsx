'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListFilter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Categoria } from "@/types/types"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
export function FiltroDeProductos({ categorias }: { categorias: Categoria[] }) {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace: reemplazar } = useRouter();
    function manejoDeBusqueda(termino: string) {
        const parametros = new URLSearchParams(parametrosDeBusqueda);
        if (termino) {
            parametros.set('subCategoria', termino);
        } else {
            parametros.delete('subCategoria');
        }
        reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filtros
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <span>Categoria</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {
                                categorias.map((c) =>
                                    <DropdownMenuSub key={c._id.toString()}>
                                        <DropdownMenuSubTrigger>
                                            <span>{c.nombre}</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                {c.subCategorias?.map((sc) =>
                                                    <DropdownMenuItem
                                                        key={sc._id.toString()}
                                                        onClick={() => manejoDeBusqueda(sc._id.toString())}>
                                                        {sc.nombre}
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                )}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => manejoDeBusqueda("")}>
                    Remover filtros
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}