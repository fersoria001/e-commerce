'use client'
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Categoria, SubCategoria } from "@/types/types";
import { useState } from "react";
import { AlertaDeError } from "@/components/errores/AlertaDeError";

export function SelectorDeCategorias(
    {
        errores,
        categorias,
        setCategoria,
        valoresPorDefecto,
        setSubCategoria
    }: {
        errores?: string[]
        categorias: Categoria[],
        valoresPorDefecto?: { c: Categoria, sc: SubCategoria },
        setCategoria: (c: Categoria) => void,
        setSubCategoria: (sc: SubCategoria) => void
    }) {
    const [seleccionada, setSeleccionada] = useState<Categoria>(valoresPorDefecto?.c || categorias[0])
    return (
        <Card x-chunk="dashboard-07-chunk-2">
            <CardHeader>
                <CardTitle>Categoría del producto</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-3">
                        <Label htmlFor="category">
                            Categoría
                        </Label>
                        <Select
                            defaultValue={valoresPorDefecto?.c._id.toString()}
                            onValueChange={(v) => {
                                setCategoria(categorias.find((c) => c._id.toString() === v)!)
                                setSeleccionada(categorias.find((c) => c._id.toString() === v)!)
                            }}>
                            <SelectTrigger
                                id="category"
                                aria-label="Seleccionar categoría"
                            >
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    categorias.map((cat) => {
                                        return (
                                            <SelectItem
                                                key={cat._id.toString()}
                                                value={cat._id.toString()}>
                                                {cat.nombre}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="subcategory">
                            Subcategoría
                        </Label>
                        <Select
                            defaultValue={valoresPorDefecto?.sc._id.toString()}
                            onValueChange={(v) => setSubCategoria(seleccionada.subCategorias!.find((sc) => sc._id.toString() === v)!)}>
                            <SelectTrigger
                                id="subcategory"
                                aria-label="Seleccionar subcategoría"
                            >
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    seleccionada.subCategorias!.map((subCat) => {
                                        return (
                                            <SelectItem
                                                key={subCat._id.toString()}
                                                value={subCat._id.toString()}>
                                                {subCat.nombre}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {errores && <AlertaDeError className={"py-1 ms-1"} errores={errores} />}
            </CardContent>
        </Card>
    )
}