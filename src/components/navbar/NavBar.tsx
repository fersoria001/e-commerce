'use client'

import { useUser } from "@auth0/nextjs-auth0/client"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext, useState } from "react"
import ProfileDropdownMenu from "./ProfileDropdownMenu"
import Categorias from "./Categorias"
import { Categoria } from "@/app/layout"
import Carrito, { CarritoContext } from "../carrito/Carrito"
interface Props {
    categorias: Categoria[]
}
export function Navbar({ categorias }: Props) {
    const [showCat, setShowCat] = useState<boolean>(false)
    const pathName = usePathname()
    const { user, error, isLoading } = useUser()
    const { mostrarCarrito, setMostrarCarrito } = useContext(CarritoContext)
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    return (
        <>
            <nav className={clsx("absolute z-30 top-0 bg-transparent w-full min-h-14 flex py-5", {
                "bg-yellow-300": pathName != "/"
            })}>
                <Link
                    href={"/"}
                    className="my-auto flex shrink-0 absolute -left-2 top-0 md:-top-1 xl:left-10">
                    <Image
                        src={"/logo.png"}
                        alt="logo img"
                        sizes="(max-width:425px) 16vw, (max-width: 768px) 10vw, (max-width: 1200px) 5vw, 12vw"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        className="grayscale brightness-50"
                        width={48}
                        height={48}
                    />
                    <h1 className="text-xl my-auto -ml-3 drop-shadow-md shrink-0 font-extrabold text-black">
                        pctech
                    </h1>
                </Link>

                <ul className="flex text-black text-md md:mt-1 items-end ml-auto mr-2 space-x-1 xl:pt-12 xl:space-x-4">
                    <li onClick={() => setShowCat(!showCat)}>
                        Categorías
                    </li>
                    <li
                        className={clsx("", {
                            "hidden": !user || pathName === "/comprar"
                        })}
                        onClick={() => setMostrarCarrito(!mostrarCarrito)}>
                        carrito
                    </li>
                    <li>
                        {
                            user ?
                                <ProfileDropdownMenu user={user} />
                                :
                                <a
                                    href="/api/auth/login"
                                    className="px-2 py-0.5 bg-black text-white rounded-2xl xl:px-5 xl:py-1">
                                    ingresar
                                </a>
                        }
                    </li>
                </ul>
                {
                    showCat && <Categorias categorias={categorias} />
                }
            </nav>
            {
                mostrarCarrito && <Carrito />
            }
        </>
    )
}