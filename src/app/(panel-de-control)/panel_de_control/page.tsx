/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = 'force-dynamic'
import Link from "next/link"
import {
    Activity,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Users,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Stripe from "stripe"
import { EstadoDePedidoEnum, PeriodoEnum, Usuario } from "@/types/types"
import { calcularGanancias, finDelMes, finDelMesPasado, generarOpcionesDeRecuperacionDeSesionesDeStripe, incrementoPorcentual, inicioDelMes, inicioDelMesPasado } from "@/lib/utils"
import { obtenerTokenM2M } from "@/lib/actions"


async function obtenerUsuariosRegistrados() {
    const ahora = new Date()
    const m2MToken = await obtenerTokenM2M()
    const parametros1 = `include_totals=true&q=created_at:[* TO ${finDelMesPasado(ahora).toISOString()}]&sort=created_at:-1&search_engine=v3`
    const parametros2 = `include_totals=true&q=created_at:[${inicioDelMes(ahora).toISOString()} TO ${finDelMes(ahora).toISOString()}]&sort=created_at:-1&search_engine=v3`
    const parametros3 = `include_totals=true&sort=created_at:-1&search_engine=v3&per_page=5&page=0`
    const respuestas = await Promise.all([
        fetch(
            `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users?${parametros1}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${m2MToken}`,
                'Content-Type': 'application/json'
            }
        }),
        fetch(
            `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users?${parametros2}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${m2MToken}`,
                'Content-Type': 'application/json'
            }
        }),
        fetch(
            `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users?${parametros3}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${m2MToken}`,
                'Content-Type': 'application/json'
            }
        }),
    ])
    const [usuariosHastaElMesPasado, usuariosDeEsteMes, ultimosCincoUsuarios] = await Promise.all(respuestas.map((r) => r.json()))
    return {
        registradosHastaElMesPasado: usuariosHastaElMesPasado,
        registradosEsteMes: usuariosDeEsteMes,
        ultimosCincoRegistrados: ultimosCincoUsuarios
    }
}

export default async function Page({ searchParams: parametrosDeBusqueda }: {
    searchParams?: {
        estado?: EstadoDePedidoEnum;
        periodo?: PeriodoEnum;
        id?: string;
        ultimo?: string;
        previo?: string;
    }
}) {
    const apiKey = process.env.STRIPE_SECRET_KEY as string;
    const stripe = new Stripe(apiKey);
    const ahora = new Date()
    let opciones: any = {
        expand: ["data.customer", "data.line_items", "data.payment_intent",
            "data.payment_intent.payment_method"],
        limit: 5,
    }
    if (parametrosDeBusqueda) {
        opciones = generarOpcionesDeRecuperacionDeSesionesDeStripe({ parametrosDeBusqueda, opcionesPorDefecto: opciones })
    }
    const [
        sesionesHastaElMesPasado, todasLasSesiones, sesionesFiltradas,
        usuariosRegistrados, respuesta
    ] = await Promise.all([
        stripe.checkout.sessions.list({
            created: {
                lte: Math.floor(inicioDelMesPasado(ahora).getTime() / 1000)
            }
        }),
        stripe.checkout.sessions.list(),
        stripe.checkout.sessions.list(opciones),
        obtenerUsuariosRegistrados(),
        fetch(`${process.env.HOST}/api/analiticas/primera_visita`, {
            method: "GET"
        })
    ])
    const visitantesUnicos = await respuesta.json()
    const gananciasHastaElMesPasado = calcularGanancias(sesionesHastaElMesPasado.data)
    const todasLasGanancias = calcularGanancias(todasLasSesiones.data)
    sesionesFiltradas.data.sort((a, b) => b.created - a.created)
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos totales
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${todasLasGanancias}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {incrementoPorcentual({ actual: todasLasGanancias, pasado: gananciasHastaElMesPasado })}% del mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Usuarios registrados
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{usuariosRegistrados.registradosEsteMes.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {incrementoPorcentual({ actual: usuariosRegistrados.registradosEsteMes.total, pasado: usuariosRegistrados.registradosHastaElMesPasado.total })}% del
                            mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{todasLasSesiones.data.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {incrementoPorcentual({ actual: todasLasSesiones.data.length, pasado: sesionesHastaElMesPasado.data.length })}% del mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visitantes unicos</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{visitantesUnicos.length}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card
                    className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
                >
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Pedidos</CardTitle>
                            <CardDescription>
                                Pedidos recientes en tu tienda.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/panel_de_control/pedidos">
                                Ver todos
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="hidden xl:table-column">
                                        Tipo
                                    </TableHead>
                                    <TableHead className="hidden xl:table-column">
                                        Estado
                                    </TableHead>
                                    <TableHead className="hidden xl:table-column">
                                        Fecha
                                    </TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sesionesFiltradas.data.map((s) => {
                                    return (
                                        <TableRow key={s.id}>
                                            <TableCell>
                                                <div className="font-medium">{s.customer_details?.name}</div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    {s.customer_details?.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden xl:table-column">
                                                Compra
                                            </TableCell>
                                            <TableCell className="hidden xl:table-column">
                                                <Badge className="text-xs" variant="outline">
                                                    {s.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                                {new Date(s.created).toDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">${(s.amount_total || 0) / 100}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-5">
                    <CardHeader>
                        <CardTitle>Usuarios registrados recientemente</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        {usuariosRegistrados.ultimosCincoRegistrados.users.map((u: Usuario) => {
                            return (
                                <div
                                    key={u.user_id}
                                    className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarImage src={u.picture} alt="Avatar" />
                                        <AvatarFallback>OM</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            {u.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {u.email}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </CardContent>
                </Card>
            </div>
        </main>

    )
}
