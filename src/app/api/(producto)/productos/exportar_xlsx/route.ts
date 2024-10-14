/* eslint-disable @typescript-eslint/no-explicit-any */
import promesaDeCliente from "@/lib/mongodb";
import { match } from "assert";
import {
  lookupCategoria,
  lookupSubCategoria,
  unwindCategoria,
  unwindSubCategoria,
} from "../../lookups";
import * as XLSX from "xlsx";
import { ObjectId } from "mongodb";
function aplanarObjeto(
  obj: Record<string, any>,
  llavePadre: string = "",
  resultado: Record<string, any> = {}
): Record<string, any> {
  for (const llave in obj) {
    if (obj.hasOwnProperty(llave)) {
      const nuevaLlave = llavePadre ? `${llavePadre}.${llave}` : llave;
      if (Array.isArray(obj[llave])) {
        resultado[llave] = obj[llave].join(", ");
      } else if (obj[llave] instanceof ObjectId) {
        resultado[llave] = obj[llave].toString();
      } else if (typeof obj[llave] === "object" && obj[llave] !== null) {
        aplanarObjeto(obj[llave], nuevaLlave, resultado);
      } else {
        resultado[nuevaLlave] = obj[llave];
      }
    }
  }
  return resultado;
}
export async function GET() {
  try {
    const cliente = await promesaDeCliente.connect();
    const bd = cliente.db("bercho001");
    const resultado = await bd
      .collection("productos")
      .aggregate([
        match,
        lookupCategoria,
        lookupSubCategoria,
        unwindCategoria,
        unwindSubCategoria,
      ])
      .toArray();
    const objetoAplanado = resultado.map((r) => aplanarObjeto(r));
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils?.json_to_sheet(objetoAplanado);
    XLSX.utils.book_append_sheet(libro, hoja, "pc-tech-productos");
    const cabeceras = new Headers();
    cabeceras.append(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    cabeceras.append(
      "Content-Disposition",
      "attachment; filename=pc-tech-productos.xlsx"
    );
    const bufferXlSX = XLSX.write(libro, {
      bookType: "xlsx",
      type: "buffer",
    });
    return new Response(bufferXlSX, {
      status: 200,
      headers: cabeceras,
    });
  } catch (e) {
    return Response.json({ message: e }, { status: 500 });
  }
}
