'use client'
import Link from "next/link";
import {
    Breadcrumb, BreadcrumbList, BreadcrumbItem,
    BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function NavegacionBreadcrumb() {
    const nombreDeCamino = usePathname().split("/")
    const caminos: { nombre: string, nombreDeCamino: string }[] = []
    let ac = ""
    for (let i = 1; i <= nombreDeCamino.length; i++) {
        const nombre = nombreDeCamino[i - 1].replace(/\b[a-z](?=[a-z]{2})/, function (letra) {
            return letra.toUpperCase();
        }).replaceAll("_", " ");
        if (ac) {
            caminos.push({ nombre: nombre, nombreDeCamino: ac })
        }
        ac += `/${nombreDeCamino[i]}`
    }
    return (
        <Breadcrumb className="hidden md:flex my-5 px-6">
            <BreadcrumbList>
                {
                    caminos.map((path, i) => {
                        if (i >= caminos.length - 1) {
                            return <BreadcrumbItem key={`${path.nombreDeCamino}${Math.random()}`}>
                                <BreadcrumbPage>
                                    {path.nombre}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        }
                        return (
                            <>
                                <BreadcrumbItem key={`${path.nombre}${Math.random()}`}>
                                    <BreadcrumbLink asChild>
                                        <Link href={path.nombreDeCamino}>
                                            {path.nombre}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}