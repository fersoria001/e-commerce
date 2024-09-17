'use client'

import CarritoProvider from "@/components/carrito/CarritoProvider"
import { UserProvider } from "@auth0/nextjs-auth0/client"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <CarritoProvider>
                {children}
            </CarritoProvider>
        </UserProvider>
    )
}