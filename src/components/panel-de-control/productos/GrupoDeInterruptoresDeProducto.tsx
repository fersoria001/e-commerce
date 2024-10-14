'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function GrupoDeInterruptoresDeProducto() {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace: reemplazar } = useRouter();
    const parametroPorDefecto = parametrosDeBusqueda.get("estado") || "todos"
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
        <ToggleGroup type="single" className="rounded-md p-1" defaultValue={parametroPorDefecto}>
            <ToggleGroupItem
                onClick={() => manejarBusqueda("")}
                value="todos"
                className="font-medium">
                Todos
            </ToggleGroupItem>
            <ToggleGroupItem
                onClick={() => manejarBusqueda("activo")}
                value="activo"
                className="font-medium">
                Activos
            </ToggleGroupItem>
            <ToggleGroupItem
                onClick={() => manejarBusqueda("archivado")}
                value="archivado"
                className="font-medium">
                Archivados
            </ToggleGroupItem>
        </ToggleGroup>
    )
}