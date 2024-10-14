'use client'
import Stripe from "stripe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Producto } from "@/types/types";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
export function TablaDeMisCompras({ sesiones, recibo }: {
    sesiones: Stripe.Checkout.Session[],
    recibo?: {
        productos: Producto[],
        envio: {
            detalles: Stripe.Checkout.Session.ShippingDetails | null,
            costo: Stripe.Checkout.Session.ShippingCost | null
        }
    }
}) {
    const parametrosDeBusqueda = useSearchParams()
    const { replace: reemplazar } = useRouter()
    const nombreDeCamino = usePathname()
    const parametros = new URLSearchParams(parametrosDeBusqueda)
    function manejarBusqueda(termino: string) {
        if (termino) {
            parametros.set('id', termino);
        } else {
            parametros.delete('id');
        }
        reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
    }
    function manejarSiguiente(termino?: string) {
        if (termino) {
            parametros.delete('previo');
            parametros.set('ultimo', termino);
        } else {
            parametros.delete('id')
            parametros.delete('previo')
            parametros.delete('ultimo');
        }
        reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
    }
    function manejarPrevio(termino?: string) {
        if (termino) {
            parametros.delete('ultimo');
            parametros.set('previo', termino);
        } else {
            parametros.delete('id')
            parametros.delete('previo');
            parametros.delete('ultimo');
        }
        reemplazar(`${nombreDeCamino}?${parametros.toString()}`);
    }
    return (
        <div className="container mx-auto p-4 min-h-screen">
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className={cn("lg:col-span-3", { "lg:col-span-2": recibo })}>
                    <CardHeader>
                        <CardTitle>Pedidos</CardTitle>
                        <CardDescription>Pedidos de tu tienda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-20rem)]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                                        <TableHead className="hidden sm:table-cell">Estado</TableHead>
                                        <TableHead className="hidden md:table-cell">Fecha</TableHead>
                                        <TableHead className="text-right">Monto</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sesiones.map((s) => (
                                        <TableRow
                                            key={s.id}
                                            onClick={() => manejarBusqueda(s.id)}
                                            className={cn("cursor-pointer", {
                                                "bg-accent": parametrosDeBusqueda?.get("id") === s.id,
                                            })}
                                        >
                                            <TableCell>
                                                <div className="font-medium">{s.customer_details?.name}</div>
                                                <div className="text-sm text-muted-foreground">{s.customer_details?.email}</div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">Compra</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="secondary">{s.status}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(s.created * 1000).toLocaleDateString("es-AR")}
                                            </TableCell>
                                            <TableCell className="text-right">${(s.amount_total || 0) / 100}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        onClick={() => manejarPrevio(sesiones[0]?.id)}
                                        size="icon"
                                        variant="outline"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </PaginationItem>
                                <PaginationItem>
                                    <Button
                                        onClick={() => manejarSiguiente(sesiones[sesiones.length - 1]?.id)}
                                        size="icon"
                                        variant="outline"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>

                {recibo && (
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Detalles del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[calc(100vh-20rem)]">
                                <div className="space-y-4">
                                    {recibo.productos.map((p) => (
                                        <div key={p._id.toString()} className="flex items-center">
                                            <div className="w-16 h-16 mr-4">
                                                <Image
                                                    src={p.imgs[0]}
                                                    alt={p.nombre}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-md object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{p.nombre}</h3>
                                                <p className="text-sm text-muted-foreground">{p.descripcion}</p>
                                                <p className="font-medium">${p.precio.precio}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold">Envío</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {recibo.envio.detalles?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {recibo.envio.detalles?.address?.line1}, {recibo.envio.detalles?.address?.city}
                                        </p>
                                        <p className="font-medium">
                                            ${(recibo.envio.costo?.amount_total || 0) / 100}
                                        </p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter>
                            <div className="w-full flex justify-between items-center">
                                <span className="font-semibold">Total:</span>
                                <span className="text-2xl font-bold">
                                    $
                                    {(recibo.productos.reduce((acc, p) => acc + p.precio.precio, 0) +
                                        (recibo.envio.costo?.amount_total || 0) / 100).toFixed(2)}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}