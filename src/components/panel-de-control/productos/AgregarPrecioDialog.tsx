'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Precio, TipoDeMoneda } from "@/types/types"
import { FormEvent, useState } from "react"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PencilIcon } from "lucide-react"
import { AlertaDeError } from "@/components/errores/AlertaDeError"

export const esquemaDePrecio = z.object({
    moneda: z
        .enum(["usd"], { message: "el tipo de moneda no es válido" }),
    precio: z
        .string({ message: "escribi el precio del producto" })
        .transform((val, ctx) => {
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Not a number",
                });
                return z.NEVER;
            }
            return parsed;
        }).or(z.number()),
    stock: z
        .string({ message: "escribi la cantidad en stock" })
        .min(1, { message: "al menos un objecto debe estar en stock" })
        .transform((val, ctx) => {
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Not a number",
                });
                return z.NEVER;
            }
            return parsed;
        }).or(z.number()),
    codigo: z
        .string({ message: "escribi el codigo de referencia" }).min(3, "la longitud minima es de 3 caracteres")
})

export function AgregarPrecioDialog({ agregarPrecio, precioPorDefecto }: { agregarPrecio: (p: Precio) => void, precioPorDefecto?: Precio }) {
    const [errores, setErrores] = useState<z.inferFlattenedErrors<typeof esquemaDePrecio>>()
    const [ventanaAbierta, setVentanaAbierta] = useState<boolean>(false)
    const enviar = (e: FormEvent<HTMLFormElement>) => {
        setErrores(undefined)
        e.preventDefault()
        const datos = Object.fromEntries(new FormData(e.currentTarget))
        const { data, success, error } = esquemaDePrecio.safeParse(datos)
        if (!success) {
            setErrores(error.flatten())
            return
        }
        agregarPrecio(data)
        setVentanaAbierta(false)
        return
    }
    return (
        <Dialog open={ventanaAbierta} onOpenChange={setVentanaAbierta}>
            <DialogTrigger asChild>{
                precioPorDefecto ?
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    :
                    <Button variant="outline">Agregar</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={enviar}>
                    <DialogHeader>
                        <DialogTitle>{precioPorDefecto ? "Modificar precio" : "Agregar nuevo precio"}</DialogTitle>
                        <DialogDescription>
                            {`Podes ${precioPorDefecto ? "modificar" : "agregar"}
                             el precio, código de referencia y cantidad en stock para este producto desde acá.`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tipo-de-moneda" className="text-right">
                                Tipo de moneda
                            </Label>
                            <Select
                                name="moneda"
                                defaultValue={precioPorDefecto?.moneda}>
                                <SelectTrigger
                                    id="tipo-de-moneda"
                                    aria-label="Seleccionar moneda"

                                    className="col-span-3" >
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        (Object.keys(TipoDeMoneda) as Array<keyof typeof TipoDeMoneda>).map((key) => {
                                            return (
                                                <SelectItem
                                                    key={key}
                                                    value={key.toLowerCase()}>
                                                    {key}
                                                </SelectItem>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                            {errores?.fieldErrors.moneda &&
                                <AlertaDeError
                                    className={"py-1 grid-start-2 col-start-2 col-span-3"}
                                    errores={errores.fieldErrors.moneda} />}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="precio-numerico" className="text-right">
                                Precio
                            </Label>
                            <Input
                                id="precio-numerico"
                                name="precio"
                                placeholder="00.00"
                                defaultValue={precioPorDefecto?.precio}
                                type="number"
                                className="col-span-3"
                            />
                            {errores?.fieldErrors.precio && <AlertaDeError className={"py-1 grid-start-2 col-start-2 col-span-3"} errores={errores.fieldErrors.precio} />}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="codigo-de-referencia" className="text-right">
                                Código de referencia
                            </Label>
                            <Input
                                id="codigo-de-referencia"
                                name="codigo"
                                placeholder="GGPC-001"
                                defaultValue={precioPorDefecto?.codigo}
                                className="col-span-3"
                            />
                            {errores?.fieldErrors.codigo && <AlertaDeError className={"py-1 grid-start-2 col-start-2 col-span-3"} errores={errores.fieldErrors.codigo} />}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right">
                                Stock
                            </Label>
                            <Input
                                id="stock"
                                name="stock"
                                placeholder="0"
                                type="number"
                                defaultValue={precioPorDefecto?.stock}
                                className="col-span-3"
                            />
                            {errores?.fieldErrors.stock && <AlertaDeError className={"py-1 grid-start-2 col-start-2 col-span-3"} errores={errores.fieldErrors.stock} />}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Guardar cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
