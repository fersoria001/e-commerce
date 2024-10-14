import { EditarProducto } from "@/components/panel-de-control/productos/EditarProducto";

export default async function Page({ params }: { params: { id: string } }) {
    const promesas = [
        fetch(`${process.env.HOST}/api/categorias`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }),
        fetch(`${process.env.HOST}/api/producto/${params.id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
    ]
    const respuestas = await Promise.all(promesas)
    const [categorias, producto] = await Promise.all(respuestas.map((r) => r.json()))
    const repuesta = await fetch(`${process.env.HOST}/api/categoria/${producto.categoria?._id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const categoria = await repuesta.json()
    return (
        <EditarProducto categorias={categorias} productoPorDefecto={producto} categoriaPorDefecto={categoria} />
    )
}