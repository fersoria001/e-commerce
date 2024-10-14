'use client'

import ProveedorDeCarrito from "@/components/carrito/ProveedorDeCarrito"
import ProveedorDeFirebase from "@/components/firebase/ProveedorDeFirebase"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { ConfiguracionDeProveedores } from "@/types/types"
import { UserProvider } from "@auth0/nextjs-auth0/client"

export default function Providers({ children, config }: { children: React.ReactNode, config: ConfiguracionDeProveedores }) {
    return (
        <ProveedorDeFirebase opciones={config.configuracionDeFirebase}>
            <UserProvider>
                <ProveedorDeCarrito>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </ProveedorDeCarrito>
            </UserProvider>
        </ProveedorDeFirebase>
    )
}