import { Product } from "@/types/types"
import Image from "next/image"
import Link from "next/link"

interface Props {
    product: Product
}
export function CarouselItem({ product }: Props) {
    return (
        <Link
            href={`/producto?id=${product.id}`}
            className="h-auto w-full flex flex-col items-center p-5">
            <div className="relative w-[160px] h-[160px]">
                <Image
                    src={product.thumbnail}
                    alt={product.descripcion}
                    sizes="100vw"
                    fill
                    className="object-contain"
                />
            </div>
            <h1 className="mb-2">{product.nombre}</h1>
            <p>{product.descripcion}</p>
            <h2>Precio: ${product.precio}</h2>
        </Link>
    )
}