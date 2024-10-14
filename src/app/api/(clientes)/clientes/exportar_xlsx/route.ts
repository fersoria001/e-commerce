/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import * as XLSX from "xlsx";
function aplanarObjeto(
  obj: Record<string, any>,
  llavePadre: string = "",
  resultado: Record<string, any> = {}
): Record<string, any> {
  for (const llave in obj) {
    if (obj.hasOwnProperty(llave)) {
      const nuevaLlave = llavePadre ? `${llavePadre}.${llave}` : llave;
      if (typeof obj[llave] === "object" && obj[llave] !== null) {
        aplanarObjeto(obj[llave], nuevaLlave, resultado);
      } else {
        resultado[nuevaLlave] = obj[llave];
      }
    }
  }
  return resultado;
}
export async function GET(request: NextRequest) {
  const pagina = request.nextUrl.searchParams.get("pagina") || 1;
  const respuesta = await fetch(
    `${process.env.HOST}/api/organizacion/usuarios?pagina=${pagina}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const datos = await respuesta.json();
  const objetosPlanos = datos.users.map((u: any) => aplanarObjeto(u));
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils?.json_to_sheet(objetosPlanos);
  XLSX.utils.book_append_sheet(libro, hoja, `pc-tech-clientes`);
  const cabeceras = new Headers();
  cabeceras.append(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  cabeceras.append(
    "Content-Disposition",
    `attachment; filename=pc-tech-clientes-${new Date().toDateString()}.xlsx`
  );
  const bufferXlSX = XLSX.write(libro, {
    bookType: "xlsx",
    type: "buffer",
  });
  return new Response(bufferXlSX, {
    status: 200,
    headers: cabeceras,
  });
}
