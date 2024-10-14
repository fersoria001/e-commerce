import Stripe from "stripe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function crearPDF(
  sesion: Stripe.Checkout.Session,
  metodoDePago: Stripe.PaymentMethod
) {
  const documentoPdf = await PDFDocument.create();
  const pagina = documentoPdf.addPage([600, 800]);

  // Fuentes
  const fuenteDeTitulo = await documentoPdf.embedFont(
    StandardFonts.HelveticaBold
  );
  const fuenteDeCuerpo = await documentoPdf.embedFont(StandardFonts.Helvetica);

  // Colores y margenes
  const colorMuteado = rgb(0.7, 0.7, 0.7);
  const colorNegro = rgb(0, 0, 0);
  const margen = 40;
  let posicionY = 750;

  const dibujarTexto = (
    text: string,
    x: number,
    y: number,
    size = 12,
    font = fuenteDeCuerpo,
    color = colorNegro,
    maxWidth = 500
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    if (textWidth > maxWidth) {
      const lines = [];
      let start = 0;
      while (start < text.length) {
        let end = start + Math.floor(maxWidth / (textWidth / text.length));
        if (end < text.length && text[end] !== " ") {
          while (end > start && text[end] !== " ") {
            end--;
          }
        }
        lines.push(text.slice(start, end).trim());
        start = end + 1;
      }
      lines.forEach((line, index) => {
        pagina.drawText(line, {
          x,
          y: y - index * 15,
          size,
          font,
          color,
          lineHeight: 18,
        });
      });
    } else {
      pagina.drawText(text, { x, y, size, font, color, lineHeight: 18 });
    }
  };

  // Funcion para dibujar separadores
  const dibujarSeparador = (y: number) => {
    pagina.drawLine({
      start: { x: margen - 20, y },
      end: { x: pagina.getWidth() - margen, y },
      color: colorMuteado,
      thickness: 1,
    });
  };

  dibujarTexto(
    `ID: ${sesion.id}`,
    margen,
    posicionY,
    10,
    fuenteDeTitulo,
    colorNegro,
    500
  );
  posicionY -= 20;
  dibujarTexto(
    `Fecha: ${new Date(sesion.created * 1000).toDateString()}`,
    margen,
    posicionY,
    12,
    fuenteDeCuerpo,
    colorMuteado
  );
  posicionY -= 30;

  dibujarTexto("Detalles del pedido:", margen, posicionY, 14, fuenteDeTitulo);
  posicionY -= 20;

  sesion.line_items?.data.forEach((el) => {
    const textoDeElemento = `${el.description} x ${el.quantity} - $${(
      el.amount_total / 100
    ).toFixed(2)}`;
    dibujarTexto(textoDeElemento, margen, posicionY);
    posicionY -= 20;
  });

  dibujarTexto(
    `Subtotal: $${(sesion.amount_subtotal || 0) / 100}`,
    margen,
    posicionY
  );
  posicionY -= 20;
  dibujarTexto(
    `Costo de envío: $${(sesion.total_details?.amount_shipping || 0) / 100}`,
    margen,
    posicionY
  );
  posicionY -= 20;
  dibujarTexto(
    `Impuestos: $${(sesion.total_details?.amount_tax || 0) / 100}`,
    margen,
    posicionY
  );
  posicionY -= 20;
  dibujarTexto(
    `Total: $${(sesion.amount_total || 0) / 100}`,
    margen,
    posicionY
  );
  posicionY -= 30;

  dibujarTexto("Información de envío:", margen, posicionY, 14, fuenteDeTitulo);
  posicionY -= 20;
  const informacionDeEnvio = sesion.shipping_details;
  if (informacionDeEnvio?.address) {
    const addressText = [
      informacionDeEnvio.name,
      informacionDeEnvio.address.line1,
      informacionDeEnvio.address.line2 || "",
      informacionDeEnvio.address.city,
      informacionDeEnvio.address.state,
      informacionDeEnvio.address.country,
      informacionDeEnvio.address.postal_code,
    ]
      .filter(Boolean)
      .join(", ");
    dibujarTexto(addressText, margen, posicionY);
  } else {
    dibujarTexto("Sin información aún", margen, posicionY);
  }
  posicionY -= 40;

  dibujarSeparador(posicionY);
  posicionY -= 15;

  dibujarTexto(
    "Información del cliente:",
    margen,
    posicionY,
    14,
    fuenteDeTitulo
  );
  posicionY -= 20;
  const detallesDeCliente = sesion.customer_details;
  dibujarTexto(
    `Cliente: ${detallesDeCliente?.name || "N/A"}`,
    margen,
    posicionY
  );
  posicionY -= 20;
  dibujarTexto(
    `Correo-electrónico: ${detallesDeCliente?.email || "N/A"}`,
    margen,
    posicionY
  );
  posicionY -= 20;
  dibujarTexto(
    `Telefono: ${detallesDeCliente?.phone || "N/A"}`,
    margen,
    posicionY
  );
  posicionY -= 40;

  dibujarSeparador(posicionY);
  posicionY -= 15;

  dibujarTexto("Información de pago:", margen, posicionY, 14, fuenteDeTitulo);
  posicionY -= 20;
  const tarjeta = metodoDePago.card
    ? metodoDePago.card.brand
    : "Sin información aún";
  const ultimosCuatroDigitos = metodoDePago.card
    ? metodoDePago.card.last4
    : "0000";
  dibujarTexto(`Método: ${tarjeta}`, margen, posicionY);
  posicionY -= 20;
  dibujarTexto(
    `Número: **** **** **** ${ultimosCuatroDigitos}`,
    margen,
    posicionY
  );

  return await documentoPdf.save();
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  const sesion = await stripe.checkout.sessions.retrieve(params.id, {
    expand: [
      "customer",
      "line_items",
      "payment_intent",
      "payment_intent.payment_method",
    ],
  });
  const paymentIntent = sesion.payment_intent as Stripe.PaymentIntent;
  const paymentMethod = paymentIntent?.payment_method
    ? (paymentIntent.payment_method as Stripe.PaymentMethod)
    : null;
  if (!paymentMethod)
    return Response.json(
      { error: "couldn't find the payment method for this session" },
      { status: 500 }
    );
  const documentoPdfEnBytes = await crearPDF(sesion, paymentMethod);
  return new Response(documentoPdfEnBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="order_${sesion.id}.pdf"`,
    },
  });
}
