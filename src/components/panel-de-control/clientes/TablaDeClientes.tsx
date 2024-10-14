'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import { Usuario } from "@/types/types"
import { useSearchParams, usePathname } from "next/navigation"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GenerarEnlacesDePaginacion } from "@/components/pagination/GenerarEnlacesDePaginacion"

export function TablaDeClientes({ clientes, paginas }: { clientes: Usuario[], paginas: number }) {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const pagina = parseInt(parametrosDeBusqueda.get("pagina") || "1", 10)
    function generarParametrosDeBusqueda(p: number) {
        const parametros = new URLSearchParams(parametrosDeBusqueda);
        const termino = p.toString()
        if (termino) {
            parametros.set('pagina', termino);
        } else {
            parametros.delete('pagina');
        }

        return `${nombreDeCamino}?${decodeURIComponent(parametros.toString())}`
    }
    if (clientes.length == 0) {
        return (
            <div
                className="mt-2 h-screen flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        No tenés clientes
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Tus clientes se agregan automaticamente luego de su primer compra.
                    </p>
                    <Button className="mt-4">Agregar cliente</Button>
                </div>
            </div>
        )
    }
    return (
        <div className="mt-2">
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>Cliente</CardTitle>
                    <CardDescription>
                        Administrá tus clientes y revisá sus ultimas compras.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-screen">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Imagen</span>
                                </TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Id de cliente
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Compras
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Ultimo ingreso
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Creado
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                clientes.map((c) => {
                                    return (
                                        <TableRow key={c.email}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Image
                                                    alt="Product image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={c.picture}
                                                    width="64"
                                                />
                                            </TableCell>
                                            <TableCell className="text-xs lg:text-md font-medium">
                                                {c.email}
                                            </TableCell>
                                            <TableCell className="text-xs lg:text-md font-medium">
                                                {c.name}
                                            </TableCell>
                                            <TableCell className="text-xs lg:text-md hidden md:table-cell">
                                                <Badge variant="outline">
                                                    <TooltipProvider
                                                        disableHoverableContent={c.user_metadata?.idDeCliente != undefined}>
                                                        <Tooltip>
                                                            <TooltipTrigger className="text-xs lg:text-md">
                                                                {c.user_metadata?.idDeCliente || "info"}
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                La id de cliente se registra automáticamente
                                                                con la primer compra del usuario.
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs lg:text-md hidden md:table-cell">
                                                {c.user_metadata?.compras || 0}
                                            </TableCell>
                                            <TableCell className="text-xs lg:text-md hidden md:table-cell">
                                                {new Date(c.last_login).toUTCString()}
                                            </TableCell>
                                            <TableCell className="text-xs lg:text-md hidden md:table-cell">
                                                {new Date(c.created_at).toDateString()}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`?pagina=${pagina - 1} `}
                                    className={pagina - 1 <= 0 ? 'pointer-events-none' : ''}
                                    aria-disabled={pagina - 1 <= 0}
                                    tabIndex={pagina - 1 <= 0 ? -1 : undefined} />
                            </PaginationItem>
                            {
                                GenerarEnlacesDePaginacion(
                                    pagina,
                                    paginas,
                                    generarParametrosDeBusqueda
                                )
                            }
                            <PaginationItem>
                                <PaginationNext
                                    href={`?pagina=${pagina + 1} `}
                                    className={pagina + 1 > paginas ? 'pointer-events-none' : ''}
                                    aria-disabled={pagina + 1 > paginas}
                                    tabIndex={pagina + 1 > paginas ? -1 : undefined} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            </Card>
        </div>
    )
}