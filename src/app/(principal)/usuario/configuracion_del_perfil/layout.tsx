import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { BarraDeConfiguracionDeUsuario } from "@/components/usuario/BarraDeConfiguracionDeUsuario";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="container mx-auto py-10 h-screen">
            <div className="flex flex-col md:flex-row gap-6">
                <aside className="md:w-64 hidden md:block">
                    <BarraDeConfiguracionDeUsuario />
                </aside>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden mb-6">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <BarraDeConfiguracionDeUsuario />
                    </SheetContent>
                </Sheet>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>

    )
}