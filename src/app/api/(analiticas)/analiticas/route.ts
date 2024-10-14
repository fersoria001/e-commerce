import {
  aSerieDeTiempo,
  mejores3Geo,
  productoMasVendido,
  productosMasVistos,
  productosVendidos,
  relacionDeCarritoYCompras,
  tiempoPromedioDeImpresion,
} from "@/lib/utils";
import { GoogleCloudCredentials } from "@/types/types";
import { BigQuery } from "@google-cloud/bigquery";

export async function GET() {
  const credentials = JSON.parse( Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 as string, "base64").toString().replace(/\n/g,"")) as GoogleCloudCredentials
  const bq = new BigQuery({
    projectId: credentials.project_id,
    credentials: credentials
  });
  const dia = 24 * 7 * 1000;
  const ahora = new Date(new Date().getTime() - dia);
  const fechaInicio = new Date('2024-10-10').toISOString().split("T")[0].replaceAll("-", "");
  const fechaAyer = new Date(ahora.getTime() - dia).toISOString().split("T")[0].replaceAll("-", "");

  const [
    [todos],
    [vistasDeProducto],
    [impresiones],
    [inicioDeCompra],
    [finDeCompra]
  ] = await Promise.all([
    bq.query({
      query: `SELECT event_name, event_timestamp, geo
              FROM \`pctech-ea032.analytics_462396358.events_*\`
              WHERE _TABLE_SUFFIX BETWEEN '${fechaInicio}' AND '${fechaAyer}'
              AND event_name = 'page_view';`,
      location: "US",
    }),
    bq.query({
      query: `SELECT event_name, event_timestamp, items
              FROM \`pctech-ea032.analytics_462396358.events_*\`
              WHERE _TABLE_SUFFIX BETWEEN '${fechaInicio}' AND '${fechaAyer}'
              AND event_name = 'view_item';`,
      location: "US",
    }),
    bq.query({
      query: `SELECT event_name, event_timestamp, event_params
              FROM \`pctech-ea032.analytics_462396358.events_*\`
              WHERE _TABLE_SUFFIX BETWEEN '${fechaInicio}' AND '${fechaAyer}'
              AND event_name = 'user_engagement';`,
      location: "US",
    }),
    bq.query({
      query: `SELECT event_name, event_timestamp, items
              FROM \`pctech-ea032.analytics_462396358.events_*\`
              WHERE _TABLE_SUFFIX BETWEEN '${fechaInicio}' AND '${fechaAyer}'
              AND event_name = 'begin_checkout';`,
      location: "US",
    }),
    bq.query({
      query: `SELECT event_name, event_timestamp, items
              FROM \`pctech-ea032.analytics_462396358.events_*\`
              WHERE _TABLE_SUFFIX BETWEEN '${fechaInicio}' AND '${fechaAyer}'
              AND event_name = 'purchase';`,
      location: "US",
    }),
  ]);

  return Response.json({
    todos: aSerieDeTiempo(todos),
    mejores3Geo: mejores3Geo(todos),
    mejoresProductosPorVistas: productosMasVistos(vistasDeProducto),
    impresiones: {
      tiempoPromedio: tiempoPromedioDeImpresion(impresiones),
      diarias: aSerieDeTiempo(impresiones)
    },
    relacionInicioFinDeCompra: relacionDeCarritoYCompras({ inicioDeCompra, finDeCompra }),
    mejorProductoPorVentas: productoMasVendido(finDeCompra),
    ventas: productosVendidos(finDeCompra),
  });
}
