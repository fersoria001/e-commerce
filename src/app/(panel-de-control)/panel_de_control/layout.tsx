import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Package2, Menu } from "lucide-react";
import Link from "next/link";
import { ProductosBusqueda } from "@/components/panel-de-control/productos/ProductosBusqueda";
import { NavegacionBreadcrumb } from "@/components/panel-de-control/productos/NavegacionBreadcrumb";
import Image from "next/image";
import { getSession } from "@auth0/nextjs-auth0";
import MenuDePerfil from "@/components/barra-de-navegacion/MenuDePerfil";
import { UserProfile } from "@auth0/nextjs-auth0/client";
export default async function PanelDeControlLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession()
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className=" top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width={64}
                                height={64}
                                className="w-full h-auto brightness-0"
                            />
                        </div>
                    </Link>
                    <Link
                        href="/panel_de_control"
                        className="text-foreground transition-colors hover:text-foreground"
                    >
                        Panel
                    </Link>
                    <Link
                        href="/panel_de_control/pedidos"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Pedidos
                    </Link>
                    <Link
                        href="/panel_de_control/productos"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Productos
                    </Link>
                    <Link
                        href="/panel_de_control/clientes"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Clientes
                    </Link>
                    <Link
                        href="/panel_de_control/analiticas"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Analiticas
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Menu de navegación</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Pctech</span>
                            </Link>
                            <Link href="#" className="hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/panel_de_control/productos"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Productos
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Customers
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Analytics
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <ProductosBusqueda />
                    {
                        session?.user &&
                        <MenuDePerfil usuario={session?.user as UserProfile} />}
                </div>
            </header>
            <NavegacionBreadcrumb />
            {children}
        </div>
    );
}
