import { obtenerTokenM2M } from "@/lib/actions"
import { NextRequest } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const cuerpo = await request.json()
    const token = await obtenerTokenM2M()
    const respuesta = await fetch(`https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/users/${params.id}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({
            user_metadata: cuerpo
        })
    })
    const datos = await respuesta.json()
    return Response.json(datos)
}