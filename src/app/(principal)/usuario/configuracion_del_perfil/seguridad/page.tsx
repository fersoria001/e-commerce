export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormularioDeConfiguracionDeSeguridadUsuario } from "@/components/usuario/FormularioDeConfiguracionDeSeguridadDeUsuario"
import { getSession } from "@auth0/nextjs-auth0"
export default async function Pagina() {
    const sesion = await getSession()
    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuración de seguridad</CardTitle>
                <CardDescription>Administrar la configuración de seguridad de usuario</CardDescription>
            </CardHeader>
            <CardContent>
                <FormularioDeConfiguracionDeSeguridadUsuario usuario={sesion?.user} />
            </CardContent>
        </Card>
    )
}