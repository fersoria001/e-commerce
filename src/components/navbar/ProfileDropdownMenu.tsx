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


interface Props {
    user: UserProfile
}
export default function ProfileDropdownMenu({ user }: Props) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user.picture || ""} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>
                    <a href="/api/auth/logout">
                        Cerrar sesión
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}