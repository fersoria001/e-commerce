'use client'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { expirarSesionDeStripe } from "@/lib/actions"
import { formatoDeTitulo } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Copy, CreditCard, MoreVertical, ScanBarcodeIcon, ShieldOffIcon, Truck } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Stripe from "stripe"

export function ColumnaDePedido(
    {
        sesiones,
        actual,
        metodoDePago
    }:
        {
            sesiones: Stripe.Checkout.Session[],
            actual: Stripe.Checkout.Session | null | undefined,
            metodoDePago: Stripe.PaymentMethod | null
        }) {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace: reemplazar, refresh: refrescar } = useRouter();
    const parametros = new URLSearchParams(parametrosDeBusqueda);
    function manejarBusqueda(termino?: string) {
        if (termino) {
            parametros.set('id', termino);
        } else {
            parametros.delete('id')
        }
        reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
    }
    const idPrevio = () => {
        let indice = sesiones.findIndex((s) => s.id === actual?.id)
        if (indice >= 0)
            indice--
        if (indice >= 0 && indice < sesiones.length) return sesiones[indice].id
        return undefined
    }
    const siguienteId = () => {
        let indice = sesiones.findIndex((s) => s.id === actual?.id)
        if (indice >= 0)
            indice++
        if (indice >= 0 && indice < sesiones.length) return sesiones[indice].id
        return undefined
    }
    if (actual)
        return (
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2">
                            <p>Pedido</p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="font-bold">ID</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogDescription className="flex gap-2">
                                            <p className="text-wrap overflow-hidden break-all">{actual.id}</p>
                                            <Button
                                                onClick={() => { navigator.clipboard.writeText(actual.id) }}
                                                size="icon"
                                                variant="outline"
                                                className="h-6 w-6"
                                            >
                                                <Copy className="h-3 w-3" />
                                                <span className="sr-only">Copiar ID de pedido</span>
                                            </Button>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardTitle>
                        <CardDescription>
                            Fecha: {new Date(actual.created * 1000).toDateString()}
                        </CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        {
                            actual.status === "complete" ?
                                <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <Truck className="h-3.5 w-3.5" />
                                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                        Seguir pedido
                                    </span>
                                </Button> :
                                actual.status === "open" ?
                                    <a
                                        target="_blank"
                                        href={`${process.env.NEXT_PUBLIC_HOST}/comprar?id=${actual.client_secret}`}
                                        rel="noopener noreferrer">
                                        <Button size="sm" variant="outline" className="h-8 gap-1">
                                            <ScanBarcodeIcon className="h-3.5 w-3.5" />
                                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                                Completar compra
                                            </span>
                                        </Button>
                                    </a>
                                    :
                                    <Button size="sm" variant="outline" className="h-8 gap-1">
                                        <ShieldOffIcon className="h-3.5 w-3.5" />
                                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                            Expirado
                                        </span>
                                    </Button>
                        }
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline" className="h-8 w-8">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                    <span className="sr-only">Más</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <Link href={`${process.env.NEXT_PUBLIC_HOST}/api/pedido/${actual.id}/exportar_pdf`}>
                                    <DropdownMenuItem>
                                        Exportar
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                {actual.status === "open" &&
                                    <DropdownMenuItem onClick={async () => {
                                        await expirarSesionDeStripe({ id: actual.id })
                                        refrescar()
                                    }}>
                                        Expirar
                                    </DropdownMenuItem>
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Detalles del pedido</div>
                        <ul className="grid gap-3">
                            {
                                actual.line_items?.data.map((el) => {
                                    return (
                                        <li
                                            key={el.id}
                                            className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                {el.description} x <span>{el.quantity}</span>
                                            </span>
                                            <span>${el.amount_total / 100}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${(actual.amount_subtotal || 0) / 100}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Costo de envío</span>
                                <span>${(actual.total_details?.amount_shipping || 0) / 100}</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Impuestos</span>
                                <span>${(actual.total_details?.amount_tax || 0) / 100}</span>
                            </li>
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">Total</span>
                                <span>${(actual.amount_total || 0) / 100}</span>
                            </li>
                        </ul>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <div className="font-semibold">Información de envío</div>
                            <address className="grid gap-0.5 not-italic text-muted-foreground">
                                <span>{actual.shipping_details?.name}</span>
                                {actual.shipping_details?.address ?
                                    <span>
                                        {actual.shipping_details?.address?.line1},
                                        {actual.shipping_details?.address?.line2}
                                        {actual.shipping_details?.address?.city},
                                        {actual.shipping_details?.address?.state},
                                        {actual.shipping_details?.address?.country}
                                        {actual.shipping_details?.address?.postal_code}
                                    </span>
                                    :
                                    <span>
                                        Sin información aún
                                    </span>
                                }
                            </address>
                        </div>
                        <div className="grid auto-rows-max gap-3">
                            <div className="font-semibold">
                                Información de facturación.
                            </div>
                            <div className="text-slate-500">
                                <p>Igual que la dirección de envío.</p>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                        <div className="font-semibold">Información del cliente</div>
                        <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Cliente</dt>
                                <dd>{actual.customer_details?.name}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>
                                    <a href="mailto:">{actual.customer_details?.email}</a>
                                </dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Phone</dt>
                                <dd>
                                    <a href="tel:">{actual.customer_details?.phone}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                        <div className="font-semibold">Información de pago.</div>
                        <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <dt className="flex items-center gap-1 text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    {metodoDePago ? formatoDeTitulo(metodoDePago.card!.brand) : "Sin información aún"}
                                </dt>
                                <dd>**** **** **** {metodoDePago ? metodoDePago.card?.last4 : "0000"}</dd>
                            </div>
                        </dl>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <Pagination className="ml-auto mr-0 w-auto">
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    onClick={() => manejarBusqueda(idPrevio())}
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6">
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    <span className="sr-only">Siguiente</span>
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    onClick={() => manejarBusqueda(siguienteId())}
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6">
                                    <ChevronRight className="h-3.5 w-3.5" />
                                    <span className="sr-only">Anterior</span>
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            </Card>
        )
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2">
                        <p>Pedido</p>
                        <Button variant="outline" className="font-bold">ID</Button>
                    </CardTitle>
                    <CardDescription>

                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                    No se ha seleccionado ningún pedido aún.
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                disabled
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="sr-only">Anterior</span>
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                disabled
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Siguiente</span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardFooter>
        </Card>
    )
}