'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function GrupoDeInterruptoresDeCliente() {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace : reemplazar } = useRouter();
    const parametrosPorDefecto = parametrosDeBusqueda.get("estado") || "todos"
    function manejarBusqueda(termino: string) {
        const parametros = new URLSearchParams(parametrosDeBusqueda);
        if (termino) {
            parametros.set('estado', termino);
        } else {
            parametros.delete('estado');
        }
        reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
    }
    return (
        <ToggleGroup type="single" className="bg-stone-800 rounded-md p-1" defaultValue={parametrosPorDefecto}>
            <ToggleGroupItem
                onClick={() => manejarBusqueda("")}
                value="todos"
                size="sm"
                className="text-stone-400 text-xs md:text-sm font-medium">
                Todos
            </ToggleGroupItem>
            <ToggleGroupItem
                onClick={() => manejarBusqueda("activo")}
                value="activo"
                size="sm"
                className="text-stone-400 text-xs md:text-sm font-medium">
                Activos
            </ToggleGroupItem>
            <ToggleGroupItem
                onClick={() => manejarBusqueda("archivado")}
                value="archivado"
                size="sm"
                className="text-stone-400 text-xs md:text-sm font-medium">
                Archivados
            </ToggleGroupItem>
        </ToggleGroup>
    )
}