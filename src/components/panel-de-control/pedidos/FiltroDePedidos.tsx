'use client'
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EstadoDePedidoEnum } from "@/types/types";
import { ListFilter } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";


type LlaveDeEnum = keyof typeof EstadoDePedidoEnum
export function FiltroDePedidos() {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace: reemplazar } = useRouter();
    function manejarBusqueda(termino: string) {
        const params = new URLSearchParams(parametrosDeBusqueda);
        if (termino) {
            params.set('estado', termino);
        } else {
            params.delete('estado');
        }
        reemplazar(`${nombreDeCamino}?${params.toString()}`);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filtro</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    Object.keys(EstadoDePedidoEnum).map((l) => {
                        return (
                            <DropdownMenuCheckboxItem
                                onClick={() => manejarBusqueda(EstadoDePedidoEnum[l as LlaveDeEnum])}
                                key={l}
                                checked={parametrosDeBusqueda.get('estado') === EstadoDePedidoEnum[l as LlaveDeEnum]}>
                                {l}
                            </DropdownMenuCheckboxItem>
                        )
                    })
                }
                <DropdownMenuItem onClick={() => manejarBusqueda("")}>
                    Remover filtros
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}