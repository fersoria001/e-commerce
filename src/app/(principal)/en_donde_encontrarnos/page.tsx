export const dynamic = 'force-dynamic'
import { MapaDeGoogle } from "@/components/en-donde-encontrarnos/MapaDeGoogle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function Pagina() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">
                        Dónde Encontrarnos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-lg">
                            Estamos ubicados en el corazón de Buenos Aires, Argentina. Nuestra tienda física ofrece una experiencia única donde podrás explorar y probar los últimos productos tecnológicos.
                        </p>
                        <p className="mt-4">
                            <strong>Dirección:</strong> Av. Corrientes 1234, C1043AAZ CABA, Argentina
                        </p>
                        <p className="mt-2">
                            <strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 20:00, Sábados de 10:00 a 14:00
                        </p>
                        <p className="mt-2">
                            <strong>Teléfono:</strong> +54 11 1234-5678
                        </p>
                        <p className="mt-2">
                            <strong>Email:</strong> <a href="mailto:contacto@pctech.com" className="text-red-500 hover:text-red-600 transition-colors duration-200">contacto@pctech.com</a>
                        </p>
                    </div>

                    <div className="w-full h-[400px] relative">
                        <MapaDeGoogle />
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            ¿Venís en transporte público? Estamos a solo 5 minutos caminando desde la estación de subte &quot;Diagonal Norte&quot; (Línea C y D).
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}