export const dynamic = 'force-dynamic'
import { File, PlusCircle, } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GrupoDeInterruptoresDeProducto } from "@/components/panel-de-control/productos/GrupoDeInterruptoresDeProducto"
import { FiltroDeProductos } from "@/components/panel-de-control/productos/FiltroDeProductos"
import { cadenaDeParametrosDeBusqueda } from "@/lib/utils"
import { TablaDeProductos } from "@/components/panel-de-control/productos/TablaDeProductos"

interface ParametrosDeBusqueda {
    subCategoria?: string
    estado?: string
    pagina?: string
    consulta?: string
    limite?: string
}

export default async function Pagina({ searchParams: parametrosDeBusqueda }: { searchParams?: ParametrosDeBusqueda }) {
    const promesas = [
        fetch(`${process.env.HOST}/api/productos${cadenaDeParametrosDeBusqueda({ ...parametrosDeBusqueda, limite: "6" })}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: "no-store"
        }),
        fetch(`${process.env.HOST}/api/categorias`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
    ]
    const respuestas = await Promise.all(promesas)
    const [{ productos, paginas }, categorias] = await Promise.all(respuestas.map((r) => r.json()))
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center">
                <GrupoDeInterruptoresDeProducto />
                <div className="ml-auto flex items-center gap-2">
                    <FiltroDeProductos categorias={categorias} />
                    <Link href={`${process.env.HOST}/api/productos/exportar_xlsx`}>
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
                    <Link href={"/panel_de_control/productos/agregar"}>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Agregar producto
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
            <TablaDeProductos productos={productos} paginas={paginas} />
        </main>
    )
}
