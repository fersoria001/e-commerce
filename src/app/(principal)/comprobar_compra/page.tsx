export const dynamic = 'force-dynamic'
import { RegistrarEventoDeRetornoDeCompra } from "@/components/comprobar-compra/RegistrarEventoDeRetornoDeCompra";
import { redirect } from "next/navigation"
import Stripe from "stripe";

export default async function Pagina({ searchParams }: { searchParams?: { id?: string } }) {
    if (!searchParams?.id) {
        return redirect("/")
    }
    const apiKey = process.env.STRIPE_SECRET_KEY as string;
    const stripe = new Stripe(apiKey);
    const sesion = await stripe.checkout.sessions.retrieve(searchParams.id, {
        expand: ["line_items", "line_items.data.price.product"],
    });
    return (
        <RegistrarEventoDeRetornoDeCompra sesion={sesion} />
    )
}