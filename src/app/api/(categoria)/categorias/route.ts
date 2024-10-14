import promesaDeCliente from "@/lib/mongodb";
import { lookupCategoria } from "../lookups";

export async function GET() {
  try {
    const cliente = await promesaDeCliente.connect();
    const bd = cliente.db("bercho001");
    const categorias = await bd
      .collection("categorias")
      .aggregate([lookupCategoria])
      .toArray();
    return Response.json(categorias);
  } catch (e) {
    return Response.json({ error: e });
  }
}
