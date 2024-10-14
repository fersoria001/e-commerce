"use server";
import { Stripe } from "stripe";
import {
  EmpresasDeEnvios,
  ImageResponse,
  Producto,
  Resultado,
  MetadatosDeUsuario,
} from "../types/types";
import { redirect } from "next/navigation";
import { kv } from "@vercel/kv";
import { getSession } from "@auth0/nextjs-auth0";
import { TipoDeCrearPedido } from "@/components/panel-de-control/pedidos/CrearPedido/CrearPedido";

export const recuperarIdDecliente = async ({
  idDeUsuario,
}: {
  idDeUsuario: string;
}) => {
  const respuesta = await fetch(
    `${process.env.HOST}/api/organizacion/metadatos_de_usuario?id=${idDeUsuario}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const data = await respuesta.json();
  return data.idDeCliente || "";
};

export const recuperarSesionDeStripe = async ({
  secretoDeCliente,
}: {
  secretoDeCliente: string;
}) => {
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  const sessions = await stripe.checkout.sessions.list();
  const sesion = sessions.data.find(
    (s) => s.client_secret === secretoDeCliente
  );
  if (sesion) {
    const lineItems = await stripe.checkout.sessions.listLineItems(sesion.id, {
      expand: ["data.price.product"],
    });
    sesion.line_items = lineItems;
    const objetoSanitizado = {
      ...sesion,
      line_items: {
        ...sesion.line_items,
        data: sesion.line_items.data.map((item) =>
          JSON.parse(JSON.stringify(item))
        ),
      },
    };
    return objetoSanitizado;
  }
};

export const actualizarMetadatosDeUsuario = async ({
  idDeUsuario,
  metadatos,
}: {
  idDeUsuario: string;
  metadatos: MetadatosDeUsuario;
}) => {
  const respuesta = await fetch(
    `${process.env.HOST}/api/organizacion/metadatos_de_usuario/${idDeUsuario}`,
    {
      method: "PUT",
      body: JSON.stringify(metadatos),
    }
  );
  const datos = await respuesta.json();
  return datos;
};

export const crearClienteEnStripe = async ({
  correo,
  nombre,
  idDeUsuario,
}: {
  correo: string;
  nombre: string;
  idDeUsuario: string;
}): Promise<Stripe.Response<Stripe.Customer>> => {
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  const cliente = await stripe.customers.create({
    email: correo,
    metadata: { idDeUsuario },
    name: nombre,
  });
  return cliente;
};

export const expirarSesionDeStripe = async ({ id }: { id: string }) => {
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  return await stripe.checkout.sessions.expire(id);
};

export async function obtenerUsuario({ id }: { id: string }) {
  const respuesta = await fetch(
    `${process.env.HOST}/api/organizacion/usuario/${id}`,
    {
      method: "GET",
    }
  );
  const perfilDeUsuario = await respuesta.json();
  return perfilDeUsuario;
}

export const crearPedidoEnStripe = async ({
  nuevoPedido,
}: {
  nuevoPedido: TipoDeCrearPedido;
}) => {
  let idDeCliente = await recuperarIdDecliente({
    idDeUsuario: nuevoPedido.cliente,
  });
  if (!idDeCliente) {
    const perfilDeUsuario = await obtenerUsuario({ id: nuevoPedido.cliente });
    const clienteDeStripe = await crearClienteEnStripe({
      correo: perfilDeUsuario["email"],
      nombre: perfilDeUsuario["name"],
      idDeUsuario: perfilDeUsuario["user_id"],
    });
    const usuarioActualizado = await actualizarMetadatosDeUsuario({
      idDeUsuario: perfilDeUsuario["user_id"],
      metadatos: {
        idDeCliente: clienteDeStripe.id,
      },
    });
    const metadatosDeUsuarioActualizados = usuarioActualizado[
      "user_metadata"
    ] as MetadatosDeUsuario;
    idDeCliente = metadatosDeUsuarioActualizados.idDeCliente;
  }
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  const rutaDeComprobarCompra = `${process.env.HOST}/api/comprobar_compra?id_de_sesion={CHECKOUT_SESSION_ID}`;
  const sesion = await stripe.checkout.sessions.create({
    client_reference_id: idDeCliente,
    customer: idDeCliente,
    customer_update: {
      address: "auto",
      shipping: "auto",
    },
    payment_intent_data: {
      setup_future_usage: "off_session",
    },
    phone_number_collection: {
      enabled: true,
    },
    saved_payment_method_options: {
      payment_method_save: "enabled",
    },
    ui_mode: "embedded",
    shipping_address_collection: {
      allowed_countries: ["US", "AR"],
    },
    line_items: nuevoPedido.productos.map((p) => {
      return { price: p.idDePrecio, quantity: p.cantidad };
    }),
    shipping_options: nuevoPedido.opcionesDeEnvio.map((id) => {
      return {
        shipping_rate: id,
      };
    }),
    mode: "payment",
    return_url: rutaDeComprobarCompra,
  });

  if (!sesion.client_secret) throw new Error("Error creando sesion de stripe");

  return {
    secretoDeCliente: sesion.client_secret,
  };
};

export const crearOrdenDeCompraEnStripe = async ({
  productos,
}: {
  productos: Producto[];
}) => {
  const sesionDeUsuario = await getSession();
  if (!sesionDeUsuario) {
    throw new Error("intentó crear una sesion de stripe sin autenticacion");
  }
  let idDeCliente = await recuperarIdDecliente({
    idDeUsuario: sesionDeUsuario.user.sub,
  });
  if (!idDeCliente) {
    const clienteDeStripe = await crearClienteEnStripe({
      correo: sesionDeUsuario.user.email,
      nombre: sesionDeUsuario.user.name,
      idDeUsuario: sesionDeUsuario.user.sub,
    });
    const usuarioActualizado = await actualizarMetadatosDeUsuario({
      idDeUsuario: sesionDeUsuario.user.sub,
      metadatos: { idDeCliente: clienteDeStripe.id },
    });
    const metadatosDeUsuario = usuarioActualizado[
      "user_metadata"
    ] as MetadatosDeUsuario;
    idDeCliente = metadatosDeUsuario.idDeCliente;
  }
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  const rutaDeComprobarCompra = `${process.env.HOST}/api/comprobar_compra?id_de_sesion={CHECKOUT_SESSION_ID}`;
  const session = await stripe.checkout.sessions.create({
    client_reference_id: idDeCliente,
    customer: idDeCliente,
    customer_update: {
      address: "auto",
      shipping: "auto",
    },
    payment_intent_data: {
      setup_future_usage: "off_session",
    },
    phone_number_collection: {
      enabled: true,
    },
    saved_payment_method_options: {
      payment_method_save: "enabled",
    },
    ui_mode: "embedded",
    shipping_address_collection: {
      allowed_countries: ["US", "AR"],
    },
    line_items: productos.map((p) => {
      return { price: p.precio.idDePrecio, quantity: p.cantidad };
    }),
    shipping_options: Object.keys(EmpresasDeEnvios).map((k) => {
      return {
        shipping_rate: EmpresasDeEnvios[k as keyof typeof EmpresasDeEnvios],
      };
    }),
    mode: "payment",
    return_url: rutaDeComprobarCompra,
  });

  if (!session.client_secret)
    throw new Error("Error initiating Stripe session");

  return {
    secretoDeCliente: session.client_secret,
  };
};

export async function editarProducto(
  producto: Producto
): Promise<void | { error: string }> {
  const respuesta = await fetch(`${process.env.HOST}/api/producto`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });
  if (!respuesta.ok) {
    return {
      error:
        "error al intentar actualizar un producto desde una acción de servidor utilizando la api de pcTech",
    };
  }
  redirect("/panel_de_control/productos");
}

export async function agregarNuevoProducto(
  nuevoProducto: Partial<Producto>
): Promise<void | { error: string }> {
  const respuesta = await fetch(`${process.env.HOST}/api/producto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoProducto),
  });
  if (!respuesta.ok) {
    throw new Error("error trying to fetch producto api");
  }
  redirect("/panel_de_control/productos");
}

export async function subirImagen(datos: FormData): Promise<Resultado<string>> {
  const apiUrl = process.env.IMG_HOST_REQUEST_URL as string;
  const apiKey = process.env.IMG_HOST_API_KEY as string;

  if (!apiUrl) {
    throw new Error(
      'variable de entorno ínvalida o no disponible: "IMG_HOST_REQUEST_URL"'
    );
  }

  if (!apiKey) {
    throw new Error(
      'variable de entorno ínvalida o no disponible: "IMG_HOST_API_KEY"'
    );
  }

  const origen = datos.get("source");

  if (!origen) {
    throw new Error(
      "el archivo de origen no esta presente en los datos del formulario al intentar subir una foto"
    );
  }

  const carga = new FormData();
  carga.append("key", apiKey);
  carga.append("action", "upload");
  carga.append("source", origen);

  try {
    const respuesta = await fetch(apiUrl, {
      method: "POST",
      body: carga,
    });
    if (respuesta.ok) {
      const datos = (await respuesta.json()) as ImageResponse;
      if (datos.success.code == 200) {
        return { datos: datos.image.url, exito: true };
      } else {
        return {
          datos: `Subir una imagen falló con los datos: ${datos}`,
          exito: false,
        };
      }
    } else {
      return {
        datos: `Subir una imagen falló con respuesta: ${respuesta.statusText}`,
        exito: false,
      };
    }
  } catch (error) {
    return {
      datos: `Error durante suba de imagen: ${error}`,
      exito: false,
    };
  }
}

export async function obtenerTokenM2M(): Promise<string> {
  let valor = await kv.get("auth0-m2m-token");
  if (!valor) {
    const intentarAutenticacion = await fetch(
      `${process.env.HOST}/api/organizacion/autenticacion`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (intentarAutenticacion.status !== 200) {
      throw new Error(
        "no se pudo guardar el token m2m en vercel-kv mediante la api de pcTech"
      );
    }
    valor = await kv.get("auth0-m2m-token");
    if (!valor) {
      throw new Error(
        "no se pudo obtener el token m2m de vercel-kv luego de guardarlo con la api de pcTech"
      );
    }
    return valor as string;
  }
  return valor as string;
}
