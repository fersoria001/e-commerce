'use client'
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { Categoria } from "@/types/types"


interface Props {
    categorias: Categoria[]
}
export default function Categorias({ categorias }: Props) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="dark:text-white">
                        Categorias
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 w-[180px] md:w-screen md:max-w-xl">
                            {categorias.map((c) => (
                                <div key={c._id.toString()} className="space-y-2">
                                    <h2 className="font-bold text-lg">{c.nombre}</h2>
                                    <Separator className="my-2" />
                                    <ul className="space-y-1">
                                        {c.subCategorias?.map((sc) => (
                                            <li key={sc._id.toString()} className="min-w-fit">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={`/${sc._id.toString()}`}
                                                        className="block py-1 text-sm hover:underline"
                                                    >
                                                        {sc.nombre}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
        </NavigationMenu>
    )
}