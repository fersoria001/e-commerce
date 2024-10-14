// src/app/api/checkout-return/route.ts

import { Producto } from "@/types/types";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import Stripe from "stripe";

async function actualizarStockDeProducto(
  sesion: Stripe.Response<Stripe.Checkout.Session>
) {
  const respuesta = await fetch(`${process.env.HOST}/api/productos`, {
    method: "POST",
    body: JSON.stringify(
      sesion.line_items?.data.map(
        (el) => new ObjectId(el.price?.product as string)
      )
    ),
  });
  const datos = await respuesta.json();
  const promesas = datos.map((p: Producto) => {
    const quantity = sesion.line_items?.data.find(
      (el) => el.price?.product === p._id.toString()
    )?.quantity;
    p.precio.stock = p.precio.stock - (quantity || 0);
    return fetch(`${process.env.HOST}/api/producto`, {
      method: "PUT",
      body: JSON.stringify(p),
    });
  });
  const respuestas = await Promise.all(promesas);
  return await Promise.all(respuestas.map((r) => r.json()));
}

async function actualizarComprasDeUsuario(
  sesion: Stripe.Response<Stripe.Checkout.Session>
) {
  const usuario = await getSession();
  let respuesta = await fetch(
    `${process.env.HOST}/api/organizacion/metadatos_de_usuario?id=${usuario?.user.sub}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const cantidad = sesion.line_items?.data.reduce(
    (ac, el) => ac + el.quantity!,
    0
  );
  const datos = await respuesta.json();
  const cuerpo = {
    ...datos,
    compras: datos.compras ? datos.compras + cantidad : cantidad,
  };
  respuesta = await fetch(
    `${process.env.HOST}/api/organizacion/metadatos_de_usuario/${usuario?.user.sub}`,
    {
      method: "PUT",
      body: JSON.stringify(cuerpo),
    }
  );
  return await respuesta.json();
}
export async function GET(request: NextRequest) {
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  const parametrosDeBusqueda = request.nextUrl.searchParams;
  const idDeSesionDeStripe = parametrosDeBusqueda.get("id_de_sesion");
  if (!idDeSesionDeStripe?.length) return redirect("/");
  const sesion = await stripe.checkout.sessions.retrieve(idDeSesionDeStripe, {
    expand: ["line_items"],
  });
  if (sesion.status === "complete") {
    //Stock update
    actualizarStockDeProducto(sesion);
    //User metadata update
    actualizarComprasDeUsuario(sesion);
    //
    return redirect(`/comprobar_compra?id=${idDeSesionDeStripe}`);
  }

  if (sesion.status === "open") {
    return redirect(`/comprobar_compra`);
  }

  return redirect("/");
}
