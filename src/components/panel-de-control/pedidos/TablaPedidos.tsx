'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Stripe from "stripe"

export function TablaDePedidos({ sesiones }: { sesiones: Stripe.Checkout.Session[] }) {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const { replace: reemplazar } = useRouter();
    const parametros = new URLSearchParams(parametrosDeBusqueda);
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
        <Card x-chunk="dashboard-05-chunk-3" className="min-h-screen flex flex-col">
            <CardHeader className="px-7">
                <CardTitle>Pedidos</CardTitle>
                <CardDescription>
                    Pedidos de tu tienda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Tipo
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Estado
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Fecha
                                </TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {
                                sesiones.map((s) => {
                                    return (
                                        <TableRow
                                            onClick={() => manejarBusqueda(s.id)}
                                            className={clsx("bg-accent cursor-pointer", {
                                                "bg-stone-100 dark:bg-stone-800": parametrosDeBusqueda.get("id") === s.id
                                            })}
                                            key={s.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {s.customer_details?.name}
                                                </div>
                                                <div className="hidden text-sm text-slate-500 md:inline">
                                                    {s.customer_details?.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                Compra
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge className="text-xs" variant="secondary">
                                                    {s.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(s.created * 1000).toUTCString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ${(s.amount_total || 0) / 100}
                                            </TableCell>
                                        </TableRow>)
                                })}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
            <CardFooter className="mt-auto">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                onClick={() => manejarPrevio(sesiones[0] ? sesiones[0].id : undefined)}
                                size="icon"
                                variant="outline"
                                className="h-6 w-6">
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="sr-only">Siguiente</span>
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                onClick={() => manejarSiguiente(sesiones[sesiones.length - 1] ? sesiones[sesiones.length - 1].id : undefined)}
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
        </Card >

    )
}
