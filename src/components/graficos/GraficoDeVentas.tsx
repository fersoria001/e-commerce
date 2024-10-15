'use client'
import {
    Area,
    AreaChart,
    XAxis,
    YAxis,
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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { SerieDeTiempo } from "@/types/types"
export function GraficoDeVentas({ ventas }: { ventas: SerieDeTiempo }) {
    return (
        <Card
            className="max-w-xs" x-chunk="charts-01-chunk-7"
        >
            <CardHeader className="space-y-0 pb-0">
                <CardDescription>Productos  vendidos</CardDescription>
                <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    {ventas.valores.reduce((ac, el) => ac + el.numero, 0)}
                    <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                       unidades
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ChartContainer
                    config={{
                        time: {
                            label: "Time",
                            color: "hsl(var(--chart-2))",
                        },
                    }}
                >
                    <AreaChart
                        accessibilityLayer
                        data={ventas.valores}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <XAxis dataKey="fecha" hide />
                        <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                        <defs>
                            <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-time)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-time)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="numero"
                            type="natural"
                            fill="url(#fillTime)"
                            fillOpacity={0.4}
                            stroke="var(--color-time)"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            formatter={(value) => (
                                <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                                    Ventas
                                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                        {value}
                                    </div>
                                </div>
                            )}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}