import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import {
  lookupCategoria,
  lookupSubCategoria,
  unwindCategoria,
  unwindSubCategoria,
} from "../lookups";
import promesaDeCliente from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const cuerpo = await request.json();
  if (!Array.isArray(cuerpo))
    return NextResponse.json(
      { message: "array expected" },
      { status: 404, statusText: "invalid URL" }
    );
  const op = cuerpo.map((id: string) => new ObjectId(id));
  const cliente = await promesaDeCliente.connect();
  const bd = cliente.db("bercho001");
  const productos = await bd
    .collection("productos")
    .aggregate([
      {
        $match: { _id: { $in: op } },
      },
      lookupCategoria,
      lookupSubCategoria,
      unwindCategoria,
      unwindSubCategoria,
    ])
    .toArray();
  return Response.json(productos);
}

export async function GET(request: NextRequest) {
  const parametrosDeBusqueda = request.nextUrl.searchParams;
  const estado = parametrosDeBusqueda.get("estado");
  const subCategoria = parametrosDeBusqueda.get("subCategoria");
  const consulta = parametrosDeBusqueda.get("consulta");
  const pagina = parseInt(parametrosDeBusqueda.get("pagina") || "1", 10);
  const limite = parseInt(parametrosDeBusqueda.get("limite") || "9", 10);

  const match = consulta
    ? {
        $match: {
          $text: { $search: consulta },
          estado: estado || { $exists: true },
          subCategoria: subCategoria
            ? new ObjectId(subCategoria)
            : { $exists: true },
        },
      }
    : {
        $match: {
          estado: estado || { $exists: true },
          subCategoria: subCategoria
            ? new ObjectId(subCategoria)
            : { $exists: true },
        },
      };

  try {
    const cliente = await promesaDeCliente.connect();
    const bd = cliente.db("bercho001");
    // await bd.collection("productos").dropIndexes();
    // await bd.collection("productos").createIndex({
    //   nombre: "text",
    //   descripcion: "text",
    //   estado: "text",
    //   "precio.codigo": "text",
    // });
    const numeroDeProductos = await bd.collection("productos").countDocuments({
      estado: estado || { $exists: true },
      subCategoria: subCategoria
        ? new ObjectId(subCategoria)
        : { $exists: true },
    });
    const paginas = Math.ceil(numeroDeProductos / limite);
    const productos = await bd
      .collection("productos")
      .aggregate([
        match,
        lookupCategoria,
        lookupSubCategoria,
        unwindCategoria,
        unwindSubCategoria,
      ])
      .skip((pagina - 1) * limite)
      .limit(limite)
      .toArray();
    return Response.json({ productos, paginas });
  } catch (e) {
    return Response.json({ error: e });
  }
}
