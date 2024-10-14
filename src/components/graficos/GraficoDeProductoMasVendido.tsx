import { Bar, BarChart, Rectangle, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer } from "../ui/chart";

export function GraficoDeProductoMasVendido({ mejorProductoPorVentas }: {
    mejorProductoPorVentas: {
        nombre: string;
        valor: number;
    }[]
}) {
    return (
        <Card
            className="max-w-xs"
            x-chunk="charts-01-chunk-3"
        >
            <CardHeader className="p-4 pb-0">
                <CardTitle>Producto más vendido</CardTitle>
                <CardDescription>
                    El producto más vendido hasta ahora es {mejorProductoPorVentas[0].nombre}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                    {mejorProductoPorVentas[0].valor}
                    <span className="text-sm font-normal text-muted-foreground">
                        ventas
                    </span>
                </div>
                <ChartContainer
                    config={{
                        valor: {
                            label: "Valor",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="ml-auto w-[72px]"
                >
                    <BarChart
                        accessibilityLayer
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                        data={mejorProductoPorVentas}
                    >
                        <Bar
                            dataKey="valor"
                            fill="hsl(var(--chart-1))"
                            radius={2}
                            fillOpacity={0.2}
                            activeIndex={6}
                            activeBar={<Rectangle fillOpacity={0.8} />}
                        />
                        <XAxis
                            dataKey="nombre"
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