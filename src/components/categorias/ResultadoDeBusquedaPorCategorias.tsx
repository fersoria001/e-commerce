'use client'
import { Producto } from "@/types/types";
import { MallaDeProductos } from "../malla/MallaDeProductos";
import { useContext, useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { ContextoDeFirebase } from "../firebase/ProveedorDeFirebase";

export function ResultadoDeBusquedaPorCategorias({ idDeCategoria, productos, paginas }: {
    idDeCategoria: string;
    productos: Producto[],
    paginas: number,
}) {
    const { analytics } = useContext(ContextoDeFirebase)
    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'view_item_list', {
                item_list_id: idDeCategoria,
                items: productos.map((p) => {
                    return {
                        item_id: p._id.toString(),
                        item_name: p.nombre,
                        item_category: p.categoria.nombre,
                        item_category2: p.subCategoria.nombre,
                        item_list_id: p.subCategoria._id.toString(),
                        price: p.precio.precio,
                    }
                })
            })
        }
    }, [analytics, idDeCategoria, productos])
    return (
        <div className="min-h-screen mt-24 xl:mt-48">
            <MallaDeProductos productos={productos} paginas={paginas} />
        </div>
    )
}