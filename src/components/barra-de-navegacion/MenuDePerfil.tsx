'use client'

import { UserProfile } from "@auth0/nextjs-auth0/client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function MenuDePerfil({ usuario }: {
    usuario: UserProfile
}) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={usuario.picture || ""} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{usuario.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                    <Link href={"/usuario/configuracion_del_perfil"}>
                        Perfil
                    </Link> No habilitado porque la conexion social de auth0 no admite cambios
                    desde acá 
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                    <Link href={"/usuario/mis_recibos"}>
                        Mis recibos
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <a href="/api/auth/logout">
                        Cerrar sesión
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}