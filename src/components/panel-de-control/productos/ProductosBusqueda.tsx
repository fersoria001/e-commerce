'use client'
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function ProductosBusqueda() {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace: reemplazar } = useRouter();
    function manejarBusqueda(termino: string) {
        const parametros = new URLSearchParams(parametrosDeBusqueda);
        if (termino) {
            parametros.set('consulta', termino);
        } else {
            parametros.delete('consulta');
        }
        if (nombreDeCamino === "/panel_de_control/productos") {
            reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
        } else {
            reemplazar(`/panel_de_control/productos?${parametros.toString()}`)
        }
    }
    return (
        <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    onChange={(e) => manejarBusqueda(e.target.value)}
                    type="search"
                    placeholder="Buscar productos..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
            </div>
        </form>
    )
}