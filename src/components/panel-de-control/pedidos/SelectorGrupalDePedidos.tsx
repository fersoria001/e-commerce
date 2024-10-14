'use client'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PeriodoEnum } from "@/types/types";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function SelectorGrupalDePedidos() {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace: reemplazar } = useRouter();
    const defaultParam = parametrosDeBusqueda.get("periodo") || PeriodoEnum.Week
    function manejarBusqueda(termino: string) {
        const parametros = new URLSearchParams(parametrosDeBusqueda);
        if (termino) {
            parametros.set('periodo', termino);
        } else {
            parametros.delete('periodo');
        }
        reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
    }
    return (
        <ToggleGroup type="single" className="rounded-md p-1" defaultValue={defaultParam}>
            <ToggleGroupItem
                onClick={() => manejarBusqueda(PeriodoEnum.Week)}
                value={PeriodoEnum.Week}
                className="text-stone-400 font-medium">
                Semana
            </ToggleGroupItem>
            <ToggleGroupItem
                onClick={() => manejarBusqueda(PeriodoEnum.Month)}
                value={PeriodoEnum.Month}
                className="text-stone-400 font-medium">
                Mes
            </ToggleGroupItem>
            <ToggleGroupItem
                onClick={() => manejarBusqueda(PeriodoEnum.Year)}
                value={PeriodoEnum.Year}
                className="text-stone-400 font-medium">
                Año
            </ToggleGroupItem>
        </ToggleGroup>
    )
}