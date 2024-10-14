import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormularioDeConfiguracionDeUsuario } from "@/components/usuario/FormularioDeConfiguracionDeUsuario"
import { getSession } from "@auth0/nextjs-auth0"


export default async function Pagina() {
    const session = await getSession()
    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuracion de cuenta</CardTitle>
                <CardDescription>Administra la informacion de tu cuenta en pcTech</CardDescription>
            </CardHeader>
            <CardContent>
                <FormularioDeConfiguracionDeUsuario usuario={session?.user} />
            </CardContent>
        </Card>
    )
}