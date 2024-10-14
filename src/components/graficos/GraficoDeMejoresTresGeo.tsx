"use client"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export function GraficoDeMejoresTresGeo({ mejores3Geo, visitasTotales }: {
    mejores3Geo: {
        pais: string;
        valor: number;
        fill: string;
    }[]
    visitasTotales: number;
}) {
    const configuracion: Record<string, ChartConfig[string]> = {};

    for (let i = 0; i < mejores3Geo.length; i++) {
        configuracion[mejores3Geo[i].pais] = {
            label: mejores3Geo[i].pais,
            color: `hsl(var(--chart-${i + 1}))`
        };
    }

    return (
        <Card className="max-w-xs" x-chunk="charts-01-chunk-5">
            <CardHeader className="items-center pb-0">
                <CardTitle>Visitas por pais</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={configuracion}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={mejores3Geo}
                            dataKey="valor"
                            nameKey="pais"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {visitasTotales.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Visitas
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Mostrando los 3 paises que más visitaron la página
                </div>
            </CardFooter>
        </Card>
    )
}
