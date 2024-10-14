export const dynamic = 'force-dynamic'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { File } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Stripe from "stripe"
import Link from "next/link"
import { EstadoDePedidoEnum, PeriodoEnum } from "@/types/types"
import {
    calcularGanancias,
    finDeLaSemana,
    finDeLaSemanaPasada,
    finDelMes,
    finDelMesPasado,
    generarOpcionesDeRecuperacionDeSesionesDeStripe,
    incrementoPorcentual,
    inicioDeLaSemana,
    inicioDeLaSemanaPasada,
    inicioDelMes,
    inicioDelMesPasado,
} from "@/lib/utils"
import { SelectorGrupalDePedidos } from "@/components/panel-de-control/pedidos/SelectorGrupalDePedidos"
import { FiltroDePedidos } from "@/components/panel-de-control/pedidos/FiltroDePedidos"
import { TablaDePedidos } from "@/components/panel-de-control/pedidos/TablaPedidos"
import { ColumnaDePedido } from "@/components/panel-de-control/pedidos/ColumnaDePedido"




interface ParametrosDeBusqueda {
    estado?: EstadoDePedidoEnum;
    periodo?: PeriodoEnum;
    id?: string;
    previo?: string;
    ultimo?: string;
}

export default async function Pagina({ searchParams: parametrosDeBusqueda }: { searchParams?: ParametrosDeBusqueda }) {
    const apiKey = process.env.STRIPE_SECRET_KEY as string;
    const stripe = new Stripe(apiKey);
    let opciones: any = {
        expand: ["data.customer", "data.line_items", "data.payment_intent", "data.payment_intent.payment_method"],
        limit: 8,
    }
    if (parametrosDeBusqueda) {
        opciones = generarOpcionesDeRecuperacionDeSesionesDeStripe({ parametrosDeBusqueda, opcionesPorDefecto: opciones })
    }
    const ahora = new Date();

    const [
        sesionesDeLaSemanaPasada,
        sesionesDeEstaSemana,
        sesionesDelMesPasado,
        sesionesDeEsteMes,
        todasLasSesiones] = await Promise.all([
            stripe.checkout.sessions.list({
                created: {
                    gte: Math.floor(inicioDeLaSemanaPasada(new Date(ahora)).getTime() / 1000),
                    lte: Math.floor(finDeLaSemanaPasada(new Date(ahora)).getTime() / 1000)
                }
            }),
            stripe.checkout.sessions.list({
                created: {
                    gte: Math.floor(inicioDeLaSemana(new Date(ahora)).getTime() / 1000),
                    lte: Math.floor(finDeLaSemana(new Date(ahora)).getTime() / 1000)
                }
            }),
            stripe.checkout.sessions.list({
                created: {
                    gte: Math.floor(inicioDelMesPasado(new Date(ahora)).getTime() / 1000),
                    lte: Math.floor(finDelMesPasado(new Date(ahora)).getTime() / 1000)
                }
            }),
            stripe.checkout.sessions.list({
                created: {
                    gte: Math.floor(inicioDelMes(new Date(ahora)).getTime() / 1000),
                    lte: Math.floor(finDelMes(new Date(ahora)).getTime() / 1000)
                }
            }),
            stripe.checkout.sessions.list(opciones)
        ])
    todasLasSesiones.data.sort((a, b) => (b.created * 1000) - (a.created * 1000));
    const gananciasDeLaSemanaPasada = calcularGanancias(sesionesDeLaSemanaPasada.data)
    const gananciasDeEstaSemana = calcularGanancias(sesionesDeEstaSemana.data)
    const gananciasDelMesPasado = calcularGanancias(sesionesDelMesPasado.data)
    const gananciasDeEsteMes = calcularGanancias(sesionesDeEsteMes.data)
    const actual = todasLasSesiones.data.find((s) => s.id === parametrosDeBusqueda?.id)
    const paymentIntent = actual?.payment_intent ? actual.payment_intent as Stripe.PaymentIntent : null
    const paymentMethod = paymentIntent?.payment_method ? paymentIntent.payment_method as Stripe.PaymentMethod : null
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    <Card
                        className="col-span-2"
                        x-chunk="dashboard-05-chunk-0">
                        <CardHeader className="pb-3">
                            <CardTitle>
                                Tus pedidos
                            </CardTitle>
                            <CardDescription className="max-w-lg text-balance leading-relaxed">
                                Presentamos nuestro tablero dinámico de pedidos para una gestión impecable y un análisis revelador.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href="/panel_de_control/pedidos/crear">
                                <Button>
                                    Crear nuevo pedido
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card x-chunk="dashboard-05-chunk-1">
                        <CardHeader className="pb-2">
                            <CardDescription>Esta semana</CardDescription>
                            <CardTitle className="text-4xl">${gananciasDeEstaSemana}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                {incrementoPorcentual({ actual: gananciasDeEstaSemana, pasado: gananciasDeLaSemanaPasada })}% de la semana pasada
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress
                                value={parseInt(incrementoPorcentual({ actual: gananciasDeEsteMes, pasado: gananciasDelMesPasado }), 10)}
                                aria-label={`incremento del ${incrementoPorcentual({ actual: gananciasDeEsteMes, pasado: gananciasDelMesPasado })}%`} />
                        </CardFooter>
                    </Card>

                    <Card x-chunk="dashboard-05-chunk-2">
                        <CardHeader className="pb-2 mb-4">
                            <CardDescription>Este mes</CardDescription>
                            <CardTitle className="text-4xl">${gananciasDeEsteMes}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                {incrementoPorcentual({ actual: gananciasDeEsteMes, pasado: gananciasDelMesPasado })}% del mes pasado
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress
                                value={parseInt(incrementoPorcentual({ actual: gananciasDeEsteMes, pasado: gananciasDelMesPasado }), 10)}
                                aria-label={`incremento del ${incrementoPorcentual({ actual: gananciasDeEsteMes, pasado: gananciasDelMesPasado })}%`} />
                        </CardFooter>
                    </Card>

                </div>

                <div className="flex items-center">
                    <SelectorGrupalDePedidos />
                    <div className="ml-auto flex items-center gap-2">
                        <FiltroDePedidos />
                        <Link href={`${process.env.HOST}/api/pedidos/exportar_xlsx`}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 text-sm"
                            >
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">
                                    Exportar
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>
                <TablaDePedidos sesiones={todasLasSesiones.data} />
            </div>
            <ColumnaDePedido
                sesiones={todasLasSesiones.data}
                actual={actual}
                metodoDePago={paymentMethod} />
        </main>
    )
}