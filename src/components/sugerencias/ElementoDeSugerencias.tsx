import { Producto } from "@/types/types"
import Image from "next/image"
import Link from "next/link"


export function ElementoDeSugerencias({ producto }: {
    producto: Producto
}) {
    return (
        <Link
            href={`/producto?id=${producto._id.toString()}`}
            className="h-auto w-full flex flex-col items-center p-5">
            <div className="relative w-[160px] h-[160px]">
                <Image
                    src={producto.imgs[0]}
                    alt={producto.descripcion}
                    sizes="100vw"
                    fill
                    className="object-contain"
                />
            </div>
            <h1 className="mb-2">{producto.nombre}</h1>
            <h2>Precio: ${producto.precio.precio}</h2>
        </Link>
    )
}