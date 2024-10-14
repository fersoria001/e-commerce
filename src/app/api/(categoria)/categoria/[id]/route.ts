
import { ObjectId } from "mongodb";
import { lookupCategoria } from "../../lookups";
import promesaDeCliente from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await promesaDeCliente.connect();
    const bd = cliente.db("bercho001");
    const match = {
      $match: {
        _id: new ObjectId(params.id),
      },
    };
    const resultado = await bd
      .collection("categorias")
      .aggregate([match, lookupCategoria, { $limit: 1 }])
      .toArray();
    if (resultado.length === 1) {
      return Response.json(resultado[0]);
    } else {
      return new Response(null, { status: 500 });
    }
  } catch (e) {
    return Response.json({ error: e });
  }
}
