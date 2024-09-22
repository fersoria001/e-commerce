import ProductSkeleton from "@/components/producto/ProductSkeleton";
import SugerenciasSkeleton from "@/components/sugerencias/SugerenciasSkeleton";

export default function Loading(){
    return(
        <div className="min-h-screen mt-16 px-2">
            <ProductSkeleton />
            <SugerenciasSkeleton />
        </div>
    )
}