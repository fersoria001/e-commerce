export const dynamic = 'force-dynamic'
import CarouselDeProductos from "@/components/carousel/CarouselDeProductos";
import { MainBanner } from "@/components/home/MainBanner";
import { MallaDeProductos } from "@/components/malla/MallaDeProductos";
import { cadenaDeParametrosDeBusqueda } from "@/lib/utils";
interface ParametrosDeBusqueda {
  subCategoria?: string
  estado?: string
  pagina?: string
  consulta?: string
}
export default async function Pagina({ searchParams }: { searchParams?: ParametrosDeBusqueda }) {
  const respuesta = await fetch(`${process.env.HOST}/api/productos${cadenaDeParametrosDeBusqueda(searchParams)}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    cache: "no-store"
  })
  const { productos, paginas } = await respuesta.json()
  return (
    <div className="mt-2">
      <h2 className="mx-auto text-center py-2 px-3.5 w-fit rounded-md border dark:border-stone-800 dark:bg-stone-950 cursor-default">
        Esto es un modo de prueba,
        podes acceder y agregar/modificar los productos desde el panel de control.
        Ingresa al panel de control haciendo click
        <a href="/panel_de_control" className="ms-2 font-bold underline">
          acá
        </a>
        .
      </h2>
      <MainBanner />
      <section className="bg-background">
        <CarouselDeProductos productos={productos} />
      </section>
      <section>
        <h3 className="text-center text-white font-bold bg-red-500">
          Hasta 40% off
        </h3>
        <MallaDeProductos productos={productos} paginas={paginas} />
      </section>
    </div>
  );
}
