export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Pagina() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl shadow-xl border-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">
                        PcTech: Tu destino para la excelencia tecnológica
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 text-muted-foreground">
                        <p>
                            En PcTech, nos apasiona la tecnología y nos dedicamos a proporcionar a nuestros clientes los mejores componentes y
                            accesorios para sus necesidades informáticas.
                            Fundada en 2024, nuestra empresa ha crecido hasta convertirse en un líder de confianza en el mercado de hardware y periféricos
                            de PC.
                        </p>

                        <div>
                            <h2 className="text-xl font-semibold text-primary mb-2">Nuestra Misión:</h2>
                            <p>
                                Ofrecer productos de alta calidad, asesoramiento experto y
                                un servicio al cliente excepcional para ayudar a nuestros clientes a construir y mejorar sus sistemas informáticos.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-primary mb-2">Lo Que Ofrecemos:</h2>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Una amplia gama de componentes de PC, incluyendo procesadores, tarjetas gráficas, placas base y más.</li>
                                <li>Monitores de última generación para gaming y uso profesional.</li>
                                <li>Auriculares y accesorios de audio para una experiencia inmersiva.</li>
                                <li>Periféricos y accesorios para mejorar tu configuración.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-primary mb-2">Por Qué Elegirnos:</h2>
                            <ol className="list-decimal pl-6 space-y-1">
                                <li><span className="font-semibold">Calidad Garantizada:</span> Trabajamos solo con las marcas más confiables y probadas del mercado.</li>
                                <li><span className="font-semibold">Conocimiento Experto:</span> Nuestro equipo está formado por entusiastas de la tecnología que pueden asesorarte en tus compras.</li>
                                <li><span className="font-semibold">Precios Competitivos:</span> Ofrecemos los mejores productos a precios justos.</li>
                                <li><span className="font-semibold">Soporte Post-Venta:</span> Estamos aquí para ayudarte incluso después de tu compra.</li>
                            </ol>
                        </div>

                        <p>
                            En PcTech, no solo vendemos tecnología; construimos relaciones duraderas con nuestros clientes. Ya sea que estés armando tu primera PC o actualizando tu configuración profesional, estamos aquí para ayudarte en cada paso del camino.
                        </p>

                        <p className="font-semibold">
                            Únete a la comunidad PcTech y lleva tu experiencia tecnológica al siguiente nivel.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}