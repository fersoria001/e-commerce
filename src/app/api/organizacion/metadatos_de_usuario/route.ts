import { obtenerTokenM2M } from "@/lib/actions";
import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const parametrosDeBusqueda = request.nextUrl.searchParams
    let token = await obtenerTokenM2M()
    let url = `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users/`
    if (!parametrosDeBusqueda.get("id")) {
        const sesion = await getSession()
        url += sesion?.user.sub
    } else {
        url += parametrosDeBusqueda.get("id")
    }
    let respuesta = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
    })
    if (respuesta.status == 401) {
        token = await obtenerTokenM2M()
        respuesta = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` },
            cache: "no-store"
        })
    }
    const datos = await respuesta.json()
    return Response.json(datos.user_metadata || {})
}
