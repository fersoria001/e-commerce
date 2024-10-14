import { BarraDeNavegacion } from "@/components/barra-de-navegacion/BarraDeNavegacion";


export default async function PrincipalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const respuesta = await fetch(`${process.env.HOST}/api/categorias`, {
        method: "GET"
    })
    const categorias = await respuesta.json()
    return (
        <div>
            <BarraDeNavegacion categorias={categorias} />
            {children}
        </div>
    );
}
