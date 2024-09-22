'use client'

import CarritoProvider from "@/components/carrito/CarritoProvider"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { UserProfile, UserProvider } from "@auth0/nextjs-auth0/client"

export default function Providers({ children, user }: { children: React.ReactNode, user: UserProfile | undefined }) {
    return (
        <UserProvider user={user}>
            <CarritoProvider user={user}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </CarritoProvider>
        </UserProvider>
    )
}