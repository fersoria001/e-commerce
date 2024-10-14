export const dynamic = 'force-dynamic'
import { Comprar } from "@/components/compras/Comprar";
export default function Pagina({ searchParams }: { searchParams?: { id: string } }) {
    return (
        <Comprar secretoDeCliente={searchParams?.id} />
    )
}