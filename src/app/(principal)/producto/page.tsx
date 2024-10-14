export const dynamic = 'force-dynamic'
import { TarjetaDeProducto } from '@/components/producto/TarjetaDeProducto';
import { Sugerencias } from '@/components/sugerencias/Sugerencias';
export default async function Pagina({ searchParams }: { searchParams?: { id?: string } }) {
    const id = searchParams?.id || undefined;
    if (!id) {
        throw new Error("no se puede encontrar el producto porque el id es invalido o esta vacío")
    }
    const promesas = [
        fetch(`${process.env.HOST}/api/producto/${id}`, {
            method: "GET"
        }),
        fetch(`${process.env.HOST}/api/productos`, {
            method: "GET"
        })
    ]
    const respuestas = await Promise.all(promesas)
    const [producto, { productos }] = await Promise.all(respuestas.map((r) => r.json()))

    return (
        <div className="min-h-screen mt-16 px-2">
            <TarjetaDeProducto elemento={producto} />
            <Sugerencias productos={productos} />
        </div>
    )
}

