import {
    Bar,
    BarChart,
    Rectangle,
    XAxis,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
} from "@/components/ui/chart"
import { SerieDeTiempo } from "@/types/types";
export function GraficoDeImpresionesSimple({ impresiones }: {
    impresiones: {
        tiempoPromedio: number;
        diarias: SerieDeTiempo
    }
}) {
    const totalDeImpresiones = impresiones.diarias.valores.reduce((ac, v) => ac + v.numero, 0)
    const promedioDeImpresionesDiarias = Math.round(totalDeImpresiones / impresiones.diarias.valores.length) || 0
    return (
        <Card
            className="max-w-xs" x-chunk="charts-01-chunk-6"
        >
            <CardHeader className="p-4 pb-0">
                <CardTitle>Impresiones</CardTitle>
                <CardDescription>
                    El tiempo promedio por impresión es de {impresiones.tiempoPromedio}s
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
                <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
                    {promedioDeImpresionesDiarias}
                    <span className="text-sm font-normal text-muted-foreground">
                        impresiones diarias
                    </span>
                </div>
                <ChartContainer
                    config={{
                        impresiones: {
                            label: "Impresiones",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="ml-auto w-[64px]"
                >
                    <BarChart
                        accessibilityLayer
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                        data={impresiones.diarias.valores}
                    >
                        <Bar
                            dataKey="numero"
                            fill="var(--color-impresiones)"
                            radius={2}
                            fillOpacity={0.2}
                            activeIndex={6}
                            activeBar={<Rectangle fillOpacity={0.8} />}
                        />
                        <XAxis
                            dataKey="fecha"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                            hide
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}