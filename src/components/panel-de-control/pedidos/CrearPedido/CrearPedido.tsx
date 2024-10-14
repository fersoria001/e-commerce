'use client'
import { ChevronLeft, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { EmpresasDeEnvios, Producto, Usuario } from "@/types/types"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { crearPedidoEnStripe } from "@/lib/actions"
import { AlertaDeError } from "@/components/errores/AlertaDeError"

const esquemaDeFormulario = z.object({
    productos: z.array(z.object({
        idDePrecio: z.string(),
        nombre: z.string(),
        cantidad: z.number().min(1),
        precio: z.number(),
        stock: z.number()
    })).min(1, { message: "Tenes que seleccionar al menos un producto." }),
    cliente: z.string(),
    opcionesDeEnvio: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Tenes que seleccionar al menos una opcion de envío.",
    }),
})

export type TipoDeCrearPedido = z.infer<typeof esquemaDeFormulario>


export function CrearPedido({ productos, clientes }: { productos: Producto[], clientes: Usuario[] }) {
    const [estaLaVentanaAbierta, setEstaLaVentanaAbierta] = useState(false)
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
    const { push: empujar, back: retroceder } = useRouter()
    const formulario = useForm<TipoDeCrearPedido>({
        resolver: zodResolver(esquemaDeFormulario),
        defaultValues: {
            productos: [],
            cliente: "",
            opcionesDeEnvio: [],
        },
    })
    const { fields: campos, append: agregar, remove: remover } = useFieldArray({
        control: formulario.control,
        name: "productos",
    })
    async function alEnviar(nuevoPedido: TipoDeCrearPedido) {
        await crearPedidoEnStripe({ nuevoPedido })
        empujar("/panel_de_control/pedidos")
    }
    const productGroups = Object.groupBy(productos, (item) => item.subCategoria.nombre)
    return (
        <Form {...formulario}>
            <form
                onSubmit={formulario.handleSubmit(alEnviar)}
                className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => retroceder()}
                            variant="outline"
                            size="icon"
                            className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Atrás</span>
                        </Button>
                        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            Crear nuevo pedido
                        </h1>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Button type="submit" size="sm">
                                Guardar cambios
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detalles del pedido</CardTitle>
                                    <CardDescription>
                                        Elegí los productos que queres agregar a tu pedido.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col">
                                    <Dialog open={estaLaVentanaAbierta} onOpenChange={setEstaLaVentanaAbierta}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Agregar producto</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Agrega un producto
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Elegí un producto de la lista y anotar la cantidad que queres agregar al pedido.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <FormField
                                                control={formulario.control}
                                                name={`productos.${campos.length}.nombre`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Producto
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                const product = productos.find(p => p.nombre === value)
                                                                if (product) {
                                                                    setProductoSeleccionado(product)
                                                                    formulario.setValue(`productos.${campos.length}.idDePrecio`, product.precio.idDePrecio!)
                                                                    formulario.setValue(`productos.${campos.length}.stock`, product.precio.stock)
                                                                    formulario.setValue(`productos.${campos.length}.precio`, product.precio.precio)
                                                                    field.onChange(value)
                                                                }
                                                            }}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleccioná un producto" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {Object.keys(productGroups).map((key) => (
                                                                    <SelectGroup key={key}>
                                                                        <SelectLabel>{key}</SelectLabel>
                                                                        {productGroups[key as keyof typeof productGroups]?.map((v) => (
                                                                            <SelectItem value={v.nombre} key={v.precio.idDePrecio!}>
                                                                                {v.nombre}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={formulario.control}
                                                name={`productos.${campos.length}.idDePrecio`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>ID de precio del producto</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled className="bg-muted" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={formulario.control}
                                                name={`productos.${campos.length}.stock`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stock disponible</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled className="bg-muted" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={formulario.control}
                                                name={`productos.${campos.length}.precio`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Precio unitario</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled className="bg-muted" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={formulario.control}
                                                name={`productos.${campos.length}.cantidad`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Cantidad</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                max={productoSeleccionado?.precio.stock || 0}
                                                                defaultValue={0}
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value)
                                                                    if (value > (productoSeleccionado?.precio.stock || 0)) {
                                                                        formulario.setError(`productos.${campos.length}.cantidad`, {
                                                                            type: 'manual',
                                                                            message: 'La cantidad excede el stock disponible'
                                                                        })
                                                                    } else if (value === 0) {
                                                                        formulario.setError(`productos.${campos.length}.cantidad`, {
                                                                            type: 'manual',
                                                                            message: 'La cantidad no puede ser 0'
                                                                        })
                                                                    } else {
                                                                        formulario.clearErrors(`productos.${campos.length}.cantidad`)
                                                                    }
                                                                    field.onChange(value)
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <DialogFooter>
                                                <Button onClick={() => {
                                                    if (formulario.getValues(`productos.${campos.length}.cantidad`) <= (productoSeleccionado?.precio.stock || 0)) {
                                                        agregar({
                                                            idDePrecio: formulario.getValues(`productos.${campos.length}.idDePrecio`),
                                                            nombre: formulario.getValues(`productos.${campos.length}.nombre`),
                                                            cantidad: formulario.getValues(`productos.${campos.length}.cantidad`),
                                                            precio: formulario.getValues(`productos.${campos.length}.precio`),
                                                            stock: formulario.getValues(`productos.${campos.length}.stock`)
                                                        })
                                                        setEstaLaVentanaAbierta(false)
                                                        setProductoSeleccionado(null)
                                                    }
                                                }}>
                                                    Agregar producto
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <ScrollArea className="h-[200px]">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nombre</TableHead>
                                                    <TableHead>Cantidad</TableHead>
                                                    <TableHead>Precio Total</TableHead>
                                                    <TableHead>Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {campos.map((field, index) => (
                                                    <TableRow key={field.id}>
                                                        <TableCell>{formulario.watch(`productos.${index}.nombre`)}</TableCell>
                                                        <TableCell>{formulario.watch(`productos.${index}.cantidad`)}</TableCell>
                                                        <TableCell>
                                                            ${(formulario.watch(`productos.${index}.cantidad`) * formulario.watch(`productos.${index}.precio`)).toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <TrashIcon
                                                                className="cursor-pointer"
                                                                onClick={() => remover(index)} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                    <Separator></Separator>
                                    <div className="flex w-full justify-between">
                                        <p>Total</p>
                                        <p>${campos.reduce((acc, field, index) =>
                                            acc + (formulario.watch(`productos.${index}.cantidad`) * formulario.watch(`productos.${index}.precio`)), 0)}
                                        </p>
                                    </div>
                                    {formulario.formState.errors.productos?.message && (
                                        <AlertaDeError errores={[formulario.formState.errors.productos.message as string]} />
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cliente</CardTitle>
                                    <CardDescription>
                                        Elige un cliente a quien asignar este pedido, debe ser un email registrado en tu tienda.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={formulario.control}
                                        name="cliente"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un cliente" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Clientes</SelectLabel>
                                                            {
                                                                clientes.map((c) => {
                                                                    return (
                                                                        <SelectItem
                                                                            value={c.user_id}
                                                                            key={c.user_id}>
                                                                            <div className="font-medium">
                                                                                {c.name}
                                                                            </div>
                                                                            <div className="hidden text-sm text-slate-500 md:inline">
                                                                                {c.email}
                                                                            </div>
                                                                        </SelectItem>
                                                                    )
                                                                })
                                                            }
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Opciones de envio</CardTitle>
                                    <CardDescription>
                                        Elegí las opciones que tendrá disponibles el cliente al momento de pagar.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={formulario.control}
                                        name="opcionesDeEnvio"
                                        render={() => (
                                            <FormItem>
                                                {Object.entries(EmpresasDeEnvios).map(([key, value]) => (
                                                    <FormField
                                                        key={value}
                                                        control={formulario.control}
                                                        name="opcionesDeEnvio"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem key={value} className="flex flex-row items-start space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(value)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, value])
                                                                                    : field.onChange(field.value?.filter((item) => item !== value))
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">{key}</FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 md:hidden">
                        <Button type="submit" size="sm">Guardar cambios</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}