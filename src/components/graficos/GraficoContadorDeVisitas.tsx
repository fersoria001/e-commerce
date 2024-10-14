"use client"

import {
    Bar,
    BarChart,
    Label,
    Rectangle,
    ReferenceLine,
    XAxis,
} from "recharts"

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
} from "@/components/ui/chart"
import { finDelDia, inicioDelDia } from "@/lib/utils"
import { SerieDeTiempo } from "@/types/types"

export function GraficoContadorDeVisitas({
    visitas
}: {
    visitas: SerieDeTiempo
}) {
    visitas.valores.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    return (
        <Card
            className="lg:max-w-md" x-chunk="charts-01-chunk-0"
        >
            <CardHeader className="space-y-0 pb-2">
                <CardDescription>Hoy</CardDescription>
                <CardTitle className="text-4xl tabular-nums">
                    {
                        visitas.valores[visitas.valores.length - 1].numero || 0
                    }{" "}
                    <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                        visitas
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        steps: {
                            label: "numero",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                >
                    <BarChart
                        accessibilityLayer
                        margin={{
                            left: -4,
                            right: -4,
                        }}
                        data={visitas.valores}
                    >
                        <Bar
                            dataKey="numero"
                            fill="var(--color-steps)"
                            radius={5}
                            fillOpacity={0.6}
                            activeBar={<Rectangle fillOpacity={0.8} />}
                        />
                        <XAxis
                            dataKey="fecha"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("es-AR", {
                                    weekday: "short",
                                })
                            }}
                        />
                        <ChartTooltip
                            defaultIndex={2}
                            content={
                                <ChartTooltipContent
                                    hideIndicator
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("es-AR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                            cursor={false}
                        />
                        <ReferenceLine
                            y={1200}
                            stroke="hsl(var(--muted-foreground))"
                            strokeDasharray="3 3"
                            strokeWidth={1}
                        >
                            <Label
                                position="insideBottomLeft"
                                value="Average Steps"
                                offset={10}
                                fill="hsl(var(--foreground))"
                            />
                            <Label
                                position="insideTopLeft"
                                value="12,343"
                                className="text-lg"
                                fill="hsl(var(--foreground))"
                                offset={10}
                                startOffset={100}
                            />
                        </ReferenceLine>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1">
                <CardDescription>
                    En los últimos 7 dias, tuviste{" "}
                    <span className="font-medium text-foreground">
                        {
                            visitas.valores.reduce((ac, v) => {
                                const [año, mes, dia] = v.fecha.split('-');
                                const fecha = new Date(Number(año), Number(mes) - 1, Number(dia)).getTime();
                                const sieteDiasAntesDeAyer = new Date(inicioDelDia().getTime() - (24 * 60 * 60 * 1000 * 7)).getTime()
                                const finDeAyer = new Date(finDelDia().getTime() - (24 * 60 * 60 * 1000)).getTime()
                                if (fecha > sieteDiasAntesDeAyer && fecha < finDeAyer) {
                                    return ac + v.numero
                                }
                                return ac
                            }, 0)
                        }
                    </span> visitas.
                </CardDescription>
            </CardFooter>
        </Card>
    )
}