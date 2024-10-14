'use client'
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import Link from "next/link"
export function BarraDeConfiguracionDeUsuario() {
    const nombreDeCamino = usePathname()
    const secciones = nombreDeCamino.split("/")
    const seccion = secciones[secciones.length - 1]
    return (
        <div className="space-y-4">
            <Link href={"/usuario/configuracion_del_perfil"} passHref>
                <Button
                    variant={seccion === "configuracion_del_perfil" ? "default" : "ghost"}
                    className="w-full justify-start"
                >
                    Cuenta
                </Button>
            </Link>
            <Link href={"/usuario/configuracion_del_perfil/seguridad"} passHref>
                <Button
                    variant={seccion === "seguridad" ? "default" : "ghost"}
                    className="w-full justify-start"
                >
                    Seguridad
                </Button>
            </Link>
        </div>
    )
}