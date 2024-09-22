'use client'
import { Categoria } from "@/app/layout"
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


interface Props {
    categorias: Categoria[]
}
export default function Categorias({ categorias }: Props) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-white">
                        Categorias
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 w-[180px] md:w-screen md:max-w-xl">
                            {categorias.map((c) => (
                                <div key={c.id} className="space-y-2">
                                    <h2 className="font-bold text-lg">{c.categoria}</h2>
                                    <Separator className="my-2" />
                                    <ul className="space-y-1">
                                        {c.subCategorias.map((sc) => (
                                            <li key={sc} className="min-w-fit">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={`/${sc.toLowerCase()}`}
                                                        className="block py-1 text-sm hover:underline"
                                                    >
                                                        {sc}
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