'use client'

import { useUser } from "@auth0/nextjs-auth0/client"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Categorias from "./Categorias"
import { Categoria } from "@/app/layout"
import Carrito from "../carrito/Carrito"
import ProfileDropdownMenu from "./ProfileDropdownMenu"
import NavbarSkeleton from "./NavbarSkeleton"

interface Props {
    categorias: Categoria[]
}
export function Navbar({ categorias }: Props) {
    const pathName = usePathname()
    const { user, isLoading } = useUser()
    if (isLoading) return <NavbarSkeleton />;
    return (
        <>
            <nav className={clsx("z-30 top-0 bg-yellow-300 w-full flex justify-between md:px-3", {
                "bg-yellow-300": pathName != "/"
            })}>
                <Link className="flex items-center xl:px-4" href={"/"}>
                    <div className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] lg:w-[64px] lg:h-[64px]">
                        <Image
                            src={"/logo.png"}
                            alt={"logo img"}
                            sizes="100vw"
                            width={300}
                            height={300}
                            className="w-full h-auto"
                        />
                    </div>
                    <h1 className="text-lg md:text-xl drop-shadow-md font-extrabold text-black">
                        pctech
                    </h1>
                </Link>
                <div className="flex text-black text-md w-full justify-between md:ps-10">
                    <Categorias categorias={categorias} />
                    <div className="flex md:space-x-2 items-center">
                        {
                            user ?
                                <>
                                    <Carrito />
                                    <ProfileDropdownMenu user={user} />

                                </>
                                :
                                <a
                                    href="/api/auth/login"
                                    className="h-10 px-4 py-2 rounded-lg bg-stone-950 text-white hover:bg-stone-900/90">
                                    Ingresar
                                </a>
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}