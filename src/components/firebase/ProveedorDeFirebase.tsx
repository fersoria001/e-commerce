'use client'
import { Analytics, getAnalytics, isSupported } from "firebase/analytics"
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app"
import { createContext, useEffect, useState } from "react"

export type TipoDeContextoDeFirebase = {
    app: FirebaseApp | null
    analytics: Analytics | null
}

export const ContextoDeFirebase = createContext<TipoDeContextoDeFirebase>(
    {
        app: null,
        analytics: null
    }
)

export default function ProveedorDeFirebase({ children, opciones }: { children: React.ReactNode, opciones: FirebaseOptions }) {
    const [app] = useState<FirebaseApp | null>(initializeApp(opciones))
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    useEffect(() => {
        async function assignAnalytics() {
            if (app) {
                const analytics = await isSupported().then(yes => yes ? getAnalytics(app) : null);
                setAnalytics(analytics)
            }
        }
        assignAnalytics()
    }, [app])
    return (
        <ContextoDeFirebase.Provider value={{ app, analytics }}>
            {children}
        </ContextoDeFirebase.Provider>
    )
}