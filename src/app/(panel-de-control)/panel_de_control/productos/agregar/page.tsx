export const dynamic = 'force-dynamic'
import { AgregarProducto } from "@/components/panel-de-control/productos/AgregarProducto";
export default async function Pagina() {
    const respuesta = await fetch(`${process.env.HOST}/api/categorias`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const datos = await respuesta.json();
    return (
        <AgregarProducto categorias={datos}/>
    )
}