export const dynamic = 'force-dynamic'
import { CrearPedido } from "@/components/panel-de-control/pedidos/CrearPedido/CrearPedido";

export default async function Pagina() {
    const promesas = [
        fetch(`${process.env.HOST}/api/productos`, {
            method: "GET"
        }),
        fetch(`${process.env.HOST}/api/organizacion/usuarios`, {
            method: "GET"
        })
    ]
    const responses = await Promise.all(promesas)
    const [{productos}, { users: clientes }] = await Promise.all(responses.map((r) => r.json()))
    return (
        <CrearPedido productos={productos} clientes={clientes} />
    )
}