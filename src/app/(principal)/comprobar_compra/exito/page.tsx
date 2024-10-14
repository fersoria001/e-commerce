export const dynamic = 'force-dynamic'
import { Recibo } from "@/components/comprobar-compra/Recibo"
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation"
import Stripe from "stripe";


const Pagina = async ({ searchParams }: { searchParams?: { id?: string } }) => {
    if (!searchParams?.id) {
        return redirect("/")
    }
    const apiKey = process.env.STRIPE_SECRET_KEY as string;
    const stripe = new Stripe(apiKey);
    const sesion = await stripe.checkout.sessions.retrieve(searchParams.id, {
        expand: ["line_items"],
    });
    const body = JSON.stringify(sesion.line_items?.data.map((el) => new ObjectId(el.price?.product as string)))
    const respuesta = await fetch(`${process.env.HOST}/api/productos`, {
        method: "POST",
        body
    })
    const productos = await respuesta.json()
    return (
        <div className="p-2 md:p-8">
            <Recibo
                productos={productos}
                envio={{
                    detalles: sesion.shipping_details,
                    costo: sesion.shipping_cost
                }} />
        </div>
    )
}

export default Pagina