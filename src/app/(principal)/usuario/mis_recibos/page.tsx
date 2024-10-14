/* eslint-disable @typescript-eslint/no-explicit-any */
import { TablaDeMisCompras } from "@/components/compras/TablaDeMisCompras";
import { generarOpcionesDeRecuperacionDeSesionesDeStripe } from "@/lib/utils";
import { MetadatosDeUsuario } from "@/types/types";
import Stripe from "stripe";

export default async function Pagina({
    searchParams: parametrosDeBusqueda,
}: {
    searchParams?: {
        id?: string,
        previo?: string,
        ultimo?: string,
    };
}) {
    const respuesta = await fetch(
        `${process.env.HOST}/api/organizacion/metadatos_de_usuario`
    );
    const datos = (await respuesta.json()) as MetadatosDeUsuario;
    const apiKey = process.env.STRIPE_SECRET_KEY as string;
    const stripe = new Stripe(apiKey);
    let opciones: any = {
        expand: ["data.line_items"],
        customer: datos.idDeCliente,
        limit: 4,
    }
    if (parametrosDeBusqueda) {
        opciones = generarOpcionesDeRecuperacionDeSesionesDeStripe({
            parametrosDeBusqueda: {
                previo: parametrosDeBusqueda.previo,
                ultimo: parametrosDeBusqueda.ultimo,
            }, opcionesPorDefecto: opciones
        })
    }
    const sesiones = await stripe.checkout.sessions.list(opciones);
    let recibo
    if (parametrosDeBusqueda?.id) {
        const sesion = await stripe.checkout.sessions.retrieve(parametrosDeBusqueda.id,{
            expand: ["line_items"]
        })
        const body = JSON.stringify(
            sesion?.line_items?.data.map((el) => el.price?.product)
        );
        const respuesta = await fetch(`${process.env.HOST}/api/productos`, {
            method: "POST",
            body,
        });
        const productos = await respuesta.json();
        recibo = {
            productos: productos,
            envio: {
                detalles: sesion?.shipping_details || null,
                costo: sesion?.shipping_cost || null
            }
        }
    }
    return <TablaDeMisCompras sesiones={sesiones.data} recibo={recibo} />;
}
