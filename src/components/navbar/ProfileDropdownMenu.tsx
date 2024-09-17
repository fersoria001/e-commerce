'use client'

import { UserProfile } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import { useState } from "react"

interface Props {
    user: UserProfile
}
export default function ProfileDropdownMenu({ user }: Props) {
    const [show, setShow] = useState<boolean>(false)
    return (
        <div className="relative">
            <Image
                onClick={() => setShow(!show)}
                src={user.picture || "/profile.png"}
                alt="profile picture"
                height={24}
                width={24}
            />
            {
                show &&
                <div className="absolute right-0 top-10 bg-white p-3">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <a href="/api/auth/logout">
                        cerrar sesión
                    </a>
                </div>
            }
        </div>
    )
}