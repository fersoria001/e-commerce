import EsqueletoDeProducto from "@/components/producto/EsqueletoDeProducto";
import EsqueletoDeSugerencias from "@/components/sugerencias/EsqueletoDeSugerencias";

export default function Loading(){
    return(
        <div className="min-h-screen mt-16 px-2">
            <EsqueletoDeProducto />
            <EsqueletoDeSugerencias />
        </div>
    )
}