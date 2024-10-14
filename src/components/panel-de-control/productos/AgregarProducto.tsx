'use client'

import { AgregarPrecioDialog, esquemaDePrecio } from "@/components/panel-de-control/productos/AgregarPrecioDialog"
import { SubirFoto } from "@/components/panel-de-control/productos/SubirFoto"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Categoria, EstadoDelProducto, Precio, Producto, SubCategoria } from "@/types/types"
import { z } from "zod"
import { agregarNuevoProducto } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { AlertaDeError } from "@/components/errores/AlertaDeError"
import { SelectorDeCategorias } from "./SelectorDeCategorias"


const esquemaDeProducto = z.object({
    categoria: z.string({ message: "elegí una categoría para el producto" }).or(z.object({
        _id: z.string(),
        nombre: z.string(),
    })),
    subCategoria: z.string({ message: "elegí una subCategoría para el producto" }).or(z.object({
        _id: z.string(),
        categoriaId: z.string(),
        nombre: z.string(),
    })),
    nombre: z.string({ message: "elegí un nombre para tu producto" }).min(12, { message: "el mínimo es de 12 carácteres" }),
    descripcion: z.string({ message: "escribí una descripción para tu producto" }).min(20, { message: "el mínimo es de 20 carácteres" }),
    imgs: z.string().url().array().min(1, { message: "subí al menos una foto de tu producto" }),
    estado: z.enum(["activo", "archivado"], { message: "seleccioná el estado del producto" })
}).extend({
    precio: esquemaDePrecio
})

export function AgregarProducto({ categorias }: { categorias: Categoria[] }) {
    const [producto, setProducto] = useState<Partial<Producto>>({})
    const [errores, setErrores] = useState<z.inferFlattenedErrors<typeof esquemaDeProducto>>()
    const { back: retroceder } = useRouter()
    const enviar = async () => {
        setErrores(undefined)
        const { success, error } = esquemaDeProducto.safeParse(producto)
        if (!success) {
            setErrores(error.flatten())
            return
        }
        await agregarNuevoProducto(producto) //redirect
    }

    return (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => retroceder}
                    variant="outline"
                    size="icon"
                    className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Atrás</span>
                </Button>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button
                        size="sm"
                        type="button"
                        onClick={() => enviar()}
                    >
                        Agregar producto
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card x-chunk="dashboard-07-chunk-0">
                        <CardHeader>
                            <CardTitle>Detalles</CardTitle>
                            <CardDescription>
                                Escribí los detalles del producto que se mostrará en el sitio del e-commerce.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">
                                        Nombre
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        className="w-full"
                                        onChange={(e) => { setProducto(prev => { return { ...prev, nombre: e.target.value } }) }}
                                    />
                                    {errores?.fieldErrors.nombre && <AlertaDeError errores={errores.fieldErrors.nombre} />}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">
                                        Descripción
                                    </Label>
                                    <Textarea
                                        id="description"
                                        className="min-h-32"
                                        onChange={(e) => { setProducto(prev => { return { ...prev, descripcion: e.target.value } }) }}
                                    />
                                    {errores?.fieldErrors.descripcion && <AlertaDeError errores={errores.fieldErrors.descripcion} />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-07-chunk-1">
                        <CardHeader>
                            <CardTitle>Stock</CardTitle>
                            <CardDescription>
                                Acá podes registrar el precio del producto por unidad con la cantidad de objectos en stock.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Precio(USD)</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {producto.precio && <TableRow>
                                        <TableCell className="font-semibold">
                                            {producto.precio.codigo}
                                        </TableCell>
                                        <TableCell>
                                            <Label htmlFor="stock-1" className="sr-only">
                                                Stock
                                            </Label>
                                            <Input
                                                id="stock-1"
                                                type="number"
                                                defaultValue={producto.precio.stock}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Label htmlFor="price-1" className="sr-only">
                                                Precio(USD)
                                            </Label>
                                            <Input
                                                id="price-1"
                                                type="number"
                                                defaultValue={producto.precio.precio}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <AgregarPrecioDialog
                                                agregarPrecio={(p: Precio) => setProducto(prev => { return { ...prev, precio: p } })}
                                                precioPorDefecto={producto.precio}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="justify-center border-t p-4 flex flex-col">
                            {!producto.precio &&
                                <AgregarPrecioDialog
                                    agregarPrecio={(p: Precio) => setProducto(prev => { return { ...prev, precio: p } })}
                                />}
                            {errores?.fieldErrors.precio && <AlertaDeError errores={errores.fieldErrors.precio} />}
                        </CardFooter>
                    </Card>
                    <SelectorDeCategorias
                        categorias={categorias}
                        setCategoria={(c: Categoria) => {
                            setProducto(prev => { return { ...prev, categoria: c } })
                        }}
                        setSubCategoria={(sc: SubCategoria) => {
                            setProducto(prev => { return { ...prev, subCategoria: sc } })
                        }}
                        errores={errores?.fieldErrors.categoria}
                    />
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card x-chunk="dashboard-07-chunk-3">
                        <CardHeader>
                            <CardTitle>Estado del producto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select onValueChange={(e) => setProducto(prev => { return { ...prev, estado: e } })}>
                                        <SelectTrigger id="status" aria-label="Select status">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                (Object.keys(EstadoDelProducto) as Array<keyof typeof EstadoDelProducto>).map((key) => {
                                                    return (
                                                        <SelectItem
                                                            key={key}
                                                            value={key.toLowerCase()}>
                                                            {EstadoDelProducto[key]}
                                                        </SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {errores?.fieldErrors.estado && <AlertaDeError errores={errores.fieldErrors.estado} />}
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                        <CardHeader>
                            <CardTitle>Imagenes del producto</CardTitle>
                            <CardDescription>
                                Podes subir imagenes del producto acá. Existe un límite de 7 imagenes por producto.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SubirFoto
                                imgs={producto.imgs || []}
                                borrarImg={(url: string) => setProducto(prev => {
                                    return { ...prev, imgs: prev.imgs ? prev.imgs.filter((img) => img != url) : [] }
                                })}
                                agregarImg={(url: string) => setProducto(prev => { return { ...prev, imgs: prev.imgs ? [...prev.imgs, url] : [url] } })} />
                            {errores?.fieldErrors.imgs && <AlertaDeError className={"py-1"} errores={errores.fieldErrors.imgs} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
                <Button size="sm" onClick={() => enviar()}>
                    Agregar producto
                </Button>
            </div>
        </div>
    )
}