import { BigQuery } from "@google-cloud/bigquery";

export async function GET() {
  const bq = new BigQuery();
  const dia = 24 * 7 * 1000;
  const ahora = new Date(new Date().getTime() - dia);
  const fechaInicio = new Date('2024-10-10').toISOString().split("T")[0].replaceAll("-", "");
  const fechaAyer = new Date(ahora.getTime() - dia).toISOString().split("T")[0].replaceAll("-", "");
  const [[visitantesUnicos]] = await Promise.all([
    bq.query({
      query: `SELECT event_name, event_timestamp, geo
              FROM \`pctech-ea032.analytics_462396358.events_*\`
              WHERE _TABLE_SUFFIX BETWEEN '${fechaInicio}' AND '${fechaAyer}'
              AND event_name='first_visit';`,
      location: "US",
    }),
  ]);

  return Response.json(visitantesUnicos);
}
