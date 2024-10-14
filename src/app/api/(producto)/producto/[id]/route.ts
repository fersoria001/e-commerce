import { ObjectId } from "mongodb";
import {
  lookupCategoria,
  lookupSubCategoria,
  unwindCategoria,
  unwindSubCategoria,
} from "../../lookups";
import Stripe from "stripe";
import { Producto } from "@/types/types";
import promesaDeCliente from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cliente = await promesaDeCliente.connect();
  const bd = cliente.db("bercho001");
  const producto = (await bd
    .collection("productos")
    .findOne({ _id: new ObjectId(params.id) })) as Producto;
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  if (producto.precio.idDePrecio) {
    const precioDeStripe = await stripe.prices.retrieve(
      producto.precio.idDePrecio
    );
    const productoDeStripe = await stripe.products.update(
      precioDeStripe.product as string,
      {
        active: false,
      }
    );
    const precioDeStripeActualizado = await stripe.prices.update(
      producto.precio.idDePrecio,
      {
        active: false,
      }
    );
    if (!productoDeStripe.active && !precioDeStripeActualizado.active) {
      const resultadoDeBorrarProducto = await bd
        .collection("productos")
        .deleteOne({ _id: producto._id });
      return Response.json({ resultadoDeBorrarProducto }, { status: 200 });
    }
    return Response.json(
      {
        message:
          "El producto o precio de Stripe o ambos aún siguen activos en Stripe al momento de intentar borrar el producto de la base de datos de Mongo",
      },
      { status: 500 }
    );
  }
  return Response.json(
    { message: "El producto no tiene asociada una id de precio de stripe" },
    { status: 500 }
  );
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const match = {
    $match: {
      _id: new ObjectId(params.id),
    },
  };
  const cliente = await promesaDeCliente.connect();
  const bd = cliente.db("bercho001");
  const producto = await bd
    .collection("productos")
    .aggregate([
      match,
      lookupCategoria,
      lookupSubCategoria,
      unwindCategoria,
      unwindSubCategoria,
      { $limit: 1 },
    ])
    .toArray();
  if (producto.length == 1) {
    return Response.json(producto[0]);
  } else {
    return Response.json(
      { message: "no se pudo encontrar el producto con id" + params.id },
      { status: 404 }
    );
  }
}
