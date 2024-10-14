import { obtenerTokenM2M } from "@/lib/actions";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const parametrosDeBusqueda = request.nextUrl.searchParams;
  const pagina = parseInt(parametrosDeBusqueda.get("pagina") || "1", 10);
  //await kv.keys("*")
  let token = await obtenerTokenM2M();
  const parametros =  `include_totals=true&per_page=10&page=${pagina - 1}&sort=${encodeURIComponent("created_at:-1")}&search_engine=v3`
  let respuesta = await fetch(
    `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users?${parametros}`,
    {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (respuesta.status === 401) {
    token = await obtenerTokenM2M();
    respuesta = await fetch(
      `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users?${parametros}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    if (respuesta.status === 401) {
      return Response.json({ error: respuesta.statusText });
    }
  }
  const datos = await respuesta.json();
  return Response.json(datos);
}
