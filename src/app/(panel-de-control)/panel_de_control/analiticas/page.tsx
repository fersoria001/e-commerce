import { GraficosDeAnaliticas } from "@/components/graficos/GraficosDeAnaliticas";

export default async function Pagina() {
    const respuesta = await fetch(`${process.env.HOST}/api/analiticas`, {
        method: "GET",
        cache: "no-store"
    })
    const datos = await respuesta.json()
    return (
        <GraficosDeAnaliticas
            todos={datos.todos}
            mejores3Geo={datos.mejores3Geo}
            productosMasVistos={datos.mejoresProductosPorVistas}
            impresiones={datos.impresiones}
            relacionInicioFinDeCompra={datos.relacionInicioFinDeCompra}
            mejorProductoPorVentas={datos.mejorProductoPorVentas}
            ventas={datos.ventas}
        />
    )
}