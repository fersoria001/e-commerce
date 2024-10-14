import { PaginationItem, PaginationLink, PaginationEllipsis } from "../ui/pagination";

export const GenerarEnlacesDePaginacion = (
    paginaActual: number,
    paginas: number,
    parametrosDeBusqueda?: (p: number) => string
) => {
    const enlaces: JSX.Element[] = [];
    if (paginas <= 6) {
        for (let i = 1; i <= paginas; i++) {
            enlaces.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={parametrosDeBusqueda ? parametrosDeBusqueda(i) : `?page=${i}`}
                        isActive={i == paginaActual}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    } else {
        for (let i = 1; i <= 2; i++) {
            enlaces.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={parametrosDeBusqueda ? parametrosDeBusqueda(i) : `?page=${i}`}
                        isActive={i === paginaActual}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        if (2 < paginaActual && paginaActual < paginas - 1) {
            enlaces.push(<PaginationEllipsis key={"ellipsis1"} />)
            enlaces.push(
                <PaginationItem key={`ellipsis2`}>
                    <PaginationLink
                        href={parametrosDeBusqueda ? parametrosDeBusqueda(paginaActual) : `?page=${paginaActual}`}
                        isActive={true}
                    >
                        {paginaActual}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        enlaces.push(<PaginationEllipsis key={`ellipsis3`} />)
        for (let i = paginas - 1; i <= paginas; i++) {
            enlaces.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={parametrosDeBusqueda ? parametrosDeBusqueda(i) : `?page=${i}`}
                        isActive={i == paginaActual}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    }
    return enlaces;
};


