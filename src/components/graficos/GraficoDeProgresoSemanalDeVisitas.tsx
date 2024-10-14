import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { SerieDeTiempo } from "@/types/types"
import { agruparPorSemana } from "@/lib/utils"


export function GraficoDeProgresoSemanalDeVisitas({ datos }: { datos: SerieDeTiempo }) {




    const datosPorSemana = agruparPorSemana(datos.valores)
    const ultimasDosSemanas = datosPorSemana.slice(-2)

    return (
        <Card className="max-w-xs">
            <CardHeader>
                <CardTitle>Progreso</CardTitle>
                <CardDescription>
                    Visitas semanales y promedio diario
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        visits: {
                            label: "Visitas",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="aspect-auto h-[200px] w-full"
                >
                    <BarChart
                        layout="vertical"
                        data={ultimasDosSemanas}
                        margin={{ top: 30, right: 10, bottom: 10, left: 10 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis dataKey="fecha" type="category" hide />
                        <Bar dataKey="numero" fill="var(--color-visits)" barSize={32}>
                            <LabelList
                                dataKey="fecha"
                                position="insideLeft"
                                fill="white"
                                offset={10}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}