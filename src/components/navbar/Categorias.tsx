import { Categoria } from "@/app/layout"
import Link from "next/link"

interface Props {
    categorias: Categoria[]
}
export default function Categorias({ categorias }: Props) {
    console.log(categorias)
    return (
        <div className="absolute z-30 
        w-full flex border border-black bg-white text-black top-16 mt-1 lg:top-28 p-3">
            {
                categorias.map((c) => {
                    return (
                        <div key={c.id} className="w-full">
                            <h2 className="border-b border-black ps-1">{c.categoria}</h2>
                            <ul className="ps-1">
                                {
                                    c.subCategorias.map((sc) => {
                                        return (
                                            <li key={sc}>
                                                <Link href={`/${sc.toLowerCase()}`}>
                                                    {sc}
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    )
                })
            }
        </div>
    )
}