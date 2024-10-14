"use client"
import { GraficoContadorDeVisitas } from "./GraficoContadorDeVisitas"
import { SerieDeTiempo } from "@/types/types"
import { GraficoDeMejoresTresGeo } from "./GraficoDeMejoresTresGeo"
import { GraficoDeProductosMasVistos } from "./GraficoDeProductosMasVistos"
import { GraficoDeImpresionesSimple } from "./GraficoDeImpresionesSimple"
import { GraficoDeProgresoSemanalDeVisitas } from "./GraficoDeProgresoSemanalDeVisitas"
import { GraficoDeCorrelacionCarritoCompras } from "./GraficoDeCorrelacionCarritoCompras"
import { GraficoDeProductoMasVendido } from "./GraficoDeProductoMasVendido"
import { GraficoDeVentas } from "./GraficoDeVentas"

export function GraficosDeAnaliticas({
  todos,
  mejores3Geo,
  productosMasVistos,
  impresiones,
  relacionInicioFinDeCompra,
  mejorProductoPorVentas,
  ventas
}: {
  todos: SerieDeTiempo,
  mejores3Geo: {
    pais: string;
    valor: number;
    fill: string;
  }[],
  productosMasVistos: {
    nombre: string;
    valor: number;
  }[],
  impresiones: {
    tiempoPromedio: number
    diarias: SerieDeTiempo
  },
  relacionInicioFinDeCompra: {
    fecha: string;
    inicioNumero: number;
    inicioPromedio: number;
    finNumero: number;
    finPromedio: number;
  }[],
  mejorProductoPorVentas: {
    nombre: string;
    valor: number;
  }[],
  ventas: SerieDeTiempo
}) {
  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <h2 className="w-full bg:inherit border rounded-xl p-2">
        En este modo de prueba los datos que se muestran siendo del dia de hoy pueden no corresponder
        al dia de hoy por las limitaciones de exportación diaria del entorno de pruebas de Google BigQuery.
        De no estar disponibles datos del dia de hoy, se muestra en su lugar el ultimo dia registrado.
      </h2>
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <GraficoContadorDeVisitas visitas={todos} />
        <GraficoDeCorrelacionCarritoCompras relacionInicioFinDeCompra={relacionInicioFinDeCompra} />
      </div>
      <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
        <GraficoDeProgresoSemanalDeVisitas datos={todos} />
        <GraficoDeProductoMasVendido mejorProductoPorVentas={mejorProductoPorVentas} />
        <GraficoDeProductosMasVistos productosMasVistos={productosMasVistos} />
      </div>
      <div className="grid w-full flex-1 gap-6">
        <GraficoDeMejoresTresGeo mejores3Geo={mejores3Geo} visitasTotales={todos.valores.reduce((ac, el) => ac + el.numero, 0)} />
        <GraficoDeImpresionesSimple impresiones={impresiones} />
        <GraficoDeVentas ventas={ventas} />
      </div>
    </div>
  )
}
