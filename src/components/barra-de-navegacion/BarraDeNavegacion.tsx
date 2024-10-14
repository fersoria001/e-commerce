'use client'

import { useUser } from "@auth0/nextjs-auth0/client"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Categorias from "./Categorias"
import Carrito from "../carrito/Carrito"
import { Categoria } from "@/types/types"
import { InterruptorDeModo } from "./InterruptorDeModo"
import { Button } from "@/components/ui/button"
import EsqueletoDeBarraDeNavegacion from "./EsqueletoDeBarraDeNavegacion"
import MenuDePerfil from "./MenuDePerfil"

export function BarraDeNavegacion({ categorias }: {
    categorias: Categoria[]
}) {
    const nombreDeCamino = usePathname()
    const { user: usuario, isLoading: estaCargando } = useUser()
    if (estaCargando) {
        return <EsqueletoDeBarraDeNavegacion />
    }

    return (
        <header className="top-0 z-30 w-full bg-red-500">
            <nav className={clsx("flex flex-wrap items-center justify-between px-4 py-2 md:px-6", {
                "bg-red-500": nombreDeCamino !== "/"
            })}>
                <div className="flex items-center space-x-2">
                    <Link className="flex items-center space-x-2" href="/">
                        <div className="w-8 h-8 md:w-10 md:h-10">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width={64}
                                height={64}
                                className="w-full h-auto brightness-0"
                            />
                        </div>
                        <h1 className="text-lg md:text-xl font-extrabold text-black">
                            pcTech
                        </h1>
                    </Link>
                    <Categorias categorias={categorias} />
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">

                    <InterruptorDeModo />
                    {usuario ? (
                        <>
                            <Carrito />
                            <MenuDePerfil usuario={usuario} />
                        </>
                    ) : (
                        <Button asChild size="sm">
                            <a href="/api/auth/login">
                                Ingresar
                            </a>
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    )
}