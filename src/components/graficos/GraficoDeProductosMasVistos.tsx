"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
} from "@/components/ui/chart"

export function GraficoDeProductosMasVistos({ productosMasVistos }: { productosMasVistos: { nombre: string; valor: number; }[] }) {
    productosMasVistos.sort((a, b) => b.valor - a.valor)
    const productos = productosMasVistos.length > 6 ? productosMasVistos.slice(0, 6) : productosMasVistos
    const configuracion: Record<string, ChartConfig[string]> = {
        label: {
            color: "hsl(var(--background))",
        }
    };

    productos.forEach((producto, index) => {
        configuracion[producto.nombre] = {
            label: producto.nombre,
            color: `hsl(var(--chart-${index + 1}))`
        };
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Productos con más vistas</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={configuracion}>
                    <BarChart
                        accessibilityLayer
                        data={productos}
                        layout="vertical"
                        margin={{
                            right: 30,
                            left: 0,
                            top: 16,
                            bottom: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="nombre"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={120}
                        />
                        <XAxis dataKey="valor" type="number" hide />
                        <Bar
                            dataKey="valor"
                            layout="vertical"
                            radius={4}
                        >
                            {productos.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                            ))}
                            <LabelList
                                dataKey="valor"
                                position="right"
                                content={({ x, y, width, height, value }) => {
                                    if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
                                        return null;
                                    }
                                    return (
                                        <text
                                            x={x + width + 12}
                                            y={y + height / 2}
                                            fill="hsl(var(--foreground))"
                                            textAnchor="start"
                                            dominantBaseline="central"
                                            fontSize={12}
                                        >
                                            {value}
                                        </text>
                                    );
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}