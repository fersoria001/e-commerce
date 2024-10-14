import promesaDeCliente from "@/lib/mongodb";
import { Producto } from "@/types/types";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

export async function POST(request: Request) {
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  try {
    const nuevoProducto = (await request.json()) as Partial<Producto>;
    const cliente = await promesaDeCliente.connect();
    const bd = cliente.db("bercho001");
    const producto = await bd.collection("productos").insertOne({
      categoria: new ObjectId(nuevoProducto.categoria!._id),
      subCategoria: new ObjectId(nuevoProducto.subCategoria!._id),
      nombre: nuevoProducto.nombre,
      imgs: nuevoProducto.imgs,
      descripcion: nuevoProducto.descripcion,
      estado: nuevoProducto.estado,
      precio: nuevoProducto.precio,
      createdAt: new Date(),
    });
    let productoDeStripe = await stripe.products.create({
      name: nuevoProducto.nombre!,
      active: nuevoProducto.estado === "activo",
      description: nuevoProducto.descripcion,
      id: producto.insertedId.toString(),
      metadata: {
        categoria: nuevoProducto.categoria?.toString() || "",
        subCategoria: nuevoProducto.subCategoria?.toString() || "",
      },
      images: nuevoProducto.imgs,
      shippable: true,
      statement_descriptor: nuevoProducto.precio?.codigo,
      unit_label: "1",
      url: `${
        process.env.HOST
      }/producto?id=${producto.insertedId.toString()}`,
    });
    const precioDeStripe = await stripe.prices.create({
      currency: nuevoProducto.precio?.moneda || "usd",
      active: nuevoProducto.estado === "activo",
      metadata: {
        categoria: nuevoProducto.categoria?._id.toString() || "",
        subCategoria: nuevoProducto.subCategoria?._id.toString() || "",
      },
      product: productoDeStripe.id,
      unit_amount: (nuevoProducto.precio?.precio || 0) * 100,
    });
    productoDeStripe = await stripe.products.update(productoDeStripe.id, {
      default_price: precioDeStripe.id,
    });
    const productoActualizado = await bd.collection("productos").updateOne(
      { _id: producto.insertedId },
      {
        $set: { "precio.idDePrecio": precioDeStripe.id },
        $currentDate: { lastModified: true },
      }
    );
    if (productoActualizado.modifiedCount > 0) {
      return Response.json(
        { updatedFields: productoActualizado.modifiedCount },
        { status: 200 }
      );
    } else {
      return Response.json(
        { updatedFields: productoActualizado.modifiedCount },
        { status: 500 }
      );
    }
  } catch (e) {
    return Response.json({ error: e }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const productoActualizado = (await request.json()) as Producto;
  const cliente = await promesaDeCliente.connect();
  const bd = cliente.db("bercho001");
  const actualizacion = await bd.collection("productos").updateOne(
    { _id: new ObjectId(productoActualizado._id) },
    {
      $set: {
        categoria: new ObjectId(productoActualizado.categoria._id.toString()),
        subCategoria: new ObjectId(
          productoActualizado.subCategoria._id.toString()
        ),
        nombre: productoActualizado.nombre,
        imgs: productoActualizado.imgs,
        descripcion: productoActualizado.descripcion,
        estado: productoActualizado.estado,
        precio: productoActualizado.precio,
      },
      $currentDate: { lastModified: true },
    }
  );
  if (actualizacion.modifiedCount > 0) {
    return Response.json(actualizacion.modifiedCount, { status: 200 });
  } else {
    return Response.json(
      {
        error:
          "no se pudo modificar el objeto con id" +
          productoActualizado._id.toString(),
      },
      { status: 500 }
    );
  }
}
