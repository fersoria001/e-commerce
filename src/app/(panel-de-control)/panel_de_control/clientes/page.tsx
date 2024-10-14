export const dynamic = 'force-dynamic'
import { TablaDeClientes } from "@/components/panel-de-control/clientes/TablaDeClientes";
import { Button } from "@/components/ui/button";
import { cadenaDeParametrosDeBusqueda } from "@/lib/utils";
import { File } from "lucide-react";
import Link from "next/link";

export default async function Pagina({ searchParams: parametrosDeBusqueda }: {
    searchParams?: {
        pagina?: string
    }
}) {
    const respuesta = await fetch(
        `${process.env.HOST}/api/organizacion/usuarios${cadenaDeParametrosDeBusqueda(parametrosDeBusqueda)}`,
        {
            method: "GET",
            cache: "no-store"
        })
    const datos = await respuesta.json()
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Link href={`${process.env.HOST}/api/clientes/exportar_xlsx?pagina=${parametrosDeBusqueda?.pagina || 1}`}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Exportar
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
            <TablaDeClientes clientes={datos.users} paginas={Math.ceil(datos.total / 10)} />
        </main>
    )
}