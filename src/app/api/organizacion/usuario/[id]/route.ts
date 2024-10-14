import { obtenerTokenM2M } from "@/lib/actions";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const cuerpo = await request.json()
    const token = await obtenerTokenM2M()
    const respuesta = await fetch(
        `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users/${encodeURIComponent(params.id)}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify(cuerpo)
        })
    const datos = await respuesta.json()
    return Response.json(datos)
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    //await kv.keys("*")
    const token = await obtenerTokenM2M()
    const respuesta = await fetch(
        `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users/${encodeURIComponent(params.id)}`,
        {
            method: 'GET',
            headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
            cache: 'no-store'
        })
    const datos = await respuesta.json()
    return Response.json(datos)
}