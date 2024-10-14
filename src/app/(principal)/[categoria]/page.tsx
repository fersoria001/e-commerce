import { ResultadoDeBusquedaPorCategorias } from '@/components/categorias/ResultadoDeBusquedaPorCategorias';
import { cadenaDeParametrosDeBusqueda } from '@/lib/utils';


interface ParametrosDeBusqueda {
    subCategoria?: string
    estado?: string
    pagina?: string
    consulta?: string
}
export default async function Pagina({ params, searchParams }: { params: { categoria: string }, searchParams: ParametrosDeBusqueda }) {
    searchParams.subCategoria = params.categoria
    const respuesta = await fetch(`${process.env.HOST}/api/productos${cadenaDeParametrosDeBusqueda(searchParams)}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        cache: "no-store"
    })
    const { productos, paginas } = await respuesta.json()
    return (
        <ResultadoDeBusquedaPorCategorias
            idDeCategoria={params.categoria}
            productos={productos}
            paginas={paginas} />
    )
}