"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart"
import { incrementoPorcentual } from "@/lib/utils"

const configuracion = {
    inicioNumero: {
        label: "Inició intento de compra",
        color: "hsl(var(--chart-1))",
    },
    finNumero: {
        label: "Finalizó su compra",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function GraficoDeCorrelacionCarritoCompras({ relacionInicioFinDeCompra }: {
    relacionInicioFinDeCompra: {
        fecha: string;
        inicioNumero: number;
        inicioPromedio: number;
        finNumero: number;
        finPromedio: number;
    }[]
}) {
    const datos = relacionInicioFinDeCompra.sort((a, b) => parseInt(a.fecha.slice(6, 8), 10) - parseInt(b.fecha.slice(6, 8), 10)).slice(0, 6)
    const porcentaje = incrementoPorcentual({
        actual: datos[datos.length - 1].inicioNumero + datos[datos.length - 1].finNumero,
        pasado: datos[datos.length - 2].inicioNumero + datos[datos.length - 2].finNumero,
    })
    return (
        <Card className="flex flex-col lg:max-w-md" x-chunk="charts-01-chunk-1">
            <CardHeader>
                <CardTitle>Compras iniciadas / pagos realizados</CardTitle>
                <CardDescription>
                    Mostrando la comparación de compras iniciadas y pagos realizados
                    para las ultimas seis semanas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={configuracion}>
                    <AreaChart
                        accessibilityLayer
                        data={datos}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="fecha"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(5, 8)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="inicioNumero"
                            type="natural"
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.4}
                            stroke="hsl(var(--chart-1))"
                            stackId="a"
                        />
                        <Area
                            dataKey="finNumero"
                            type="natural"
                            fill="hsl(var(--chart-2))"
                            fillOpacity={0.4}
                            stroke="hsl(var(--chart-2))"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Incremento semanal de {porcentaje}%
                            {
                                porcentaje.startsWith("+") ?
                                    <TrendingUp className="h-4 w-4" /> :
                                    <TrendingDown className="h-4 w-4" />
                            }

                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
