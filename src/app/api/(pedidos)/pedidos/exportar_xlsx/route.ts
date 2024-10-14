import Stripe from "stripe";
import * as XLSX from "xlsx";
export async function GET() {
  const apiKey = process.env.STRIPE_SECRET_KEY as string;
  const stripe = new Stripe(apiKey);
  const sesiones = await stripe.checkout.sessions.list({
    expand: [
      "data.customer",
      "data.line_items",
      "data.payment_intent",
      "data.payment_intent.payment_method",
    ],
  });
  const datos = sesiones.data.map((s) => {
    return {
      id: s.id,
      cliente: s.customer_details?.name,
      tipo: "Compra",
      estado: s.status,
      fecha: new Date(s.created * 1000).toUTCString(),
      monto: `$${(s.amount_total || 0) / 100} `,
    };
  });
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils?.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(
    libro,
    hoja,
    `pc-tech-pedidos-${new Date().toDateString()}`
  );
  const cabeceras = new Headers();
  cabeceras.append(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  cabeceras.append(
    "Content-Disposition",
    `attachment; filename=pc-tech-pedidos-${new Date().toDateString()}.xlsx`
  );
  const xlsxBuffer = XLSX.write(libro, {
    bookType: "xlsx",
    type: "buffer",
  });
  return new Response(xlsxBuffer, {
    status: 200,
    headers: cabeceras,
  });
}
