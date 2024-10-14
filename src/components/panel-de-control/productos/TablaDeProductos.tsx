'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { Producto } from "@/types/types"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import Link from "next/link"
import { GenerarEnlacesDePaginacion } from "@/components/pagination/GenerarEnlacesDePaginacion"

export function TablaDeProductos({ productos, paginas }: { productos: Producto[], paginas: number }) {
    const parametrosDeBusqueda = useSearchParams();
    const nombreDeCamino = usePathname();
    const pagina = parseInt(parametrosDeBusqueda.get("pagina") || "1", 10)
    const { refresh: refrescar } = useRouter()
    function generarEnlaceDePagina(p: number) {
        const parametros = new URLSearchParams(parametrosDeBusqueda);
        const termino = p.toString()
        if (termino) {
            parametros.set('pagina', termino);
        } else {
            parametros.delete('pagina');
        }

        return `${nombreDeCamino}?${decodeURIComponent(parametros.toString())}`
    }

    if (productos.length == 0) {
        return (
            <div
                className="mt-2 h-screen flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        No tenés productos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Podes empezar a vender tan rápido como agregues un producto.
                    </p>
                    <Button className="mt-4">Agregar producto</Button>
                </div>
            </div>
        )
    }
    return (
        <div className="mt-2">
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>Productos</CardTitle>
                    <CardDescription>
                        Administrá tus productos y revisá su rendimiento en ventas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-screen">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Imagen</span>
                                </TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Categoría
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Precio(USD)
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Stock
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Creado
                                </TableHead>
                                <TableHead>
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                productos.map((p) => {

                                    return (
                                        <TableRow key={p._id.toString()}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Image
                                                    alt="Product image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={p.imgs[0]}
                                                    width="64"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {p.nombre}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {p.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <span className="flex">
                                                    {p.categoria.nombre}
                                                    <ChevronRight className="w-4 h-4 my-auto" />
                                                    {p.subCategoria.nombre}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                ${p.precio.precio}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {p.precio.stock || 0}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(p.createdAt).toUTCString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Interruptor de menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuItem>
                                                            <Link href={`/panel_de_control/productos/editar/${p._id.toString()}`}>
                                                                Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={async () => {
                                                                await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/producto/${p._id.toString()}`, {
                                                                    method: "DELETE"
                                                                })
                                                                refrescar()
                                                            }}>
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                                    href={`${generarEnlaceDePagina(pagina - 1)}`}
                                    className={pagina - 1 <= 0 ? 'pointer-events-none' : ''}
                                    aria-disabled={pagina - 1 <= 0}
                                    tabIndex={pagina - 1 <= 0 ? -1 : undefined} />
                            </PaginationItem>
                            {
                                GenerarEnlacesDePaginacion(
                                    pagina,
                                    paginas,
                                    generarEnlaceDePagina
                                )
                            }
                            <PaginationItem>
                                <PaginationNext
                                    href={`${generarEnlaceDePagina(pagina + 1)}`}
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