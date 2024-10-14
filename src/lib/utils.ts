/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EstadoDePedidoEnum,
  Evento,
  EventoConGeo,
  EventoDeProducto,
  PeriodoEnum,
  PuntoEnElTiempo,
  SerieDeTiempo,
} from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import Stripe from "stripe";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatoDeTitulo = (p: string) =>
  p.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/, function (letra) {
    return letra.toUpperCase();
  });

export function cadenaDeParametrosDeBusqueda<T>(parametrosDeBusqueda: T) {
  if (!parametrosDeBusqueda) {
    return "";
  }
  let cadena = "";
  cadena = `?`;
  const keys = Object.keys(parametrosDeBusqueda);
  for (let i = 0; i < keys.length; i++) {
    cadena += `${keys[i]}=${parametrosDeBusqueda[keys[i] as keyof T]}`;
    if (i < keys.length - 1) {
      cadena += "&";
    }
  }
  return cadena;
}

/**
 * 
 * @param fecha yyyy-mm-dd
 * @returns 
 */
const obtenerNumeroDeSemana = (fecha: string) => {
  const date = new Date(fecha)
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export const inicioDelDia = () => {
  return new Date(new Date().setUTCHours(0, 0, 0, 0));
};

export const finDelDia = () => {
  return new Date(new Date().setUTCHours(23, 59, 59, 999));
};

export const inicioDeLaSemana = (fecha: Date) => {
  const day = fecha.getDay();
  const diff = fecha.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(fecha.setDate(diff));
};

export const finDeLaSemana = (fecha: Date) => {
  const startOfWeek = inicioDeLaSemana(fecha);
  return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
};

export const inicioDelMes = (fecha: Date) =>
  new Date(fecha.getFullYear(), fecha.getMonth(), 1);

export const finDelMes = (fecha: Date) =>
  new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

export const inicioDelAño = (fecha: Date) =>
  new Date(fecha.getFullYear(), 0, 1);

export const finDelAño = (fecha: Date) => new Date(fecha.getFullYear(), 11, 31);

export const inicioDeLaSemanaPasada = (fecha: Date) => {
  const startOfWeek = inicioDeLaSemana(fecha);
  return new Date(startOfWeek.setDate(startOfWeek.getDate() - 7));
};

export const finDeLaSemanaPasada = (fecha: Date) => {
  const endOfWeek = finDeLaSemana(fecha);
  return new Date(endOfWeek.setDate(endOfWeek.getDate() - 7));
};

export const inicioDelMesPasado = (fecha: Date) =>
  new Date(fecha.getFullYear(), fecha.getMonth() - 1, 1);

export const finDelMesPasado = (fecha: Date) =>
  new Date(fecha.getFullYear(), fecha.getMonth(), 0);

export const generarOpcionesDeRecuperacionDeSesionesDeStripe = ({
  parametrosDeBusqueda,
  opcionesPorDefecto,
}: {
  opcionesPorDefecto?: any;
  parametrosDeBusqueda: {
    estado?: EstadoDePedidoEnum;
    periodo?: PeriodoEnum;
    id?: string;
    ultimo?: string;
    previo?: string;
  };
}) => {
  let opciones: any = opcionesPorDefecto ? opcionesPorDefecto : {};
  if (parametrosDeBusqueda?.periodo) {
    const ahora = new Date();
    switch (parametrosDeBusqueda.periodo) {
      case PeriodoEnum.Week:
        opciones = {
          ...opciones,
          created: {
            gte: Math.floor(inicioDeLaSemana(new Date(ahora)).getTime() / 1000),
            lte: Math.floor(finDeLaSemana(new Date(ahora)).getTime() / 1000),
          },
        };
        break;
      case PeriodoEnum.Month:
        opciones = {
          ...opciones,
          created: {
            gte: Math.floor(inicioDelMes(new Date(ahora)).getTime() / 1000),
            lte: Math.floor(finDelMes(new Date(ahora)).getTime() / 1000),
          },
        };
        break;
      case PeriodoEnum.Year:
        opciones = {
          ...opciones,
          created: {
            gte: Math.floor(inicioDelAño(new Date(ahora)).getTime() / 1000),
            lte: Math.floor(finDelAño(new Date(ahora)).getTime() / 1000),
          },
        };
        break;
      default:
        break;
    }
  }

  if (parametrosDeBusqueda?.previo) {
    opciones = {
      ...opciones,
      ending_before: parametrosDeBusqueda.previo,
    };
  }

  if (parametrosDeBusqueda?.ultimo) {
    opciones = {
      ...opciones,
      starting_after: parametrosDeBusqueda.ultimo,
    };
  }

  if (parametrosDeBusqueda?.estado) {
    opciones = {
      ...opciones,
      status: parametrosDeBusqueda.estado,
    };
  }
  return opciones;
};
export const calcularGanancias = (sesiones: Stripe.Checkout.Session[]) => {
  return (
    sesiones
      .filter((s) => s.status === "complete")
      .reduce((ac, s) => ac + (s.amount_total || 0), 0) / 100
  );
};

export const incrementoPorcentual = ({
  actual,
  pasado,
}: {
  actual: number;
  pasado: number;
}): string => {
  if (pasado === 0) return actual === 0 ? "0" : "+100";
  const diff = actual - pasado;
  const percentage = ((diff / pasado) * 100).toFixed(2);
  if (parseInt(percentage, 10) > 0) {
    return `+${percentage}`;
  }
  return `${percentage}`;
};

export function aSerieDeTiempo(eventos: Evento[]): SerieDeTiempo {
  const gruposPorFecha = Object.groupBy(
    eventos,
    (e: Evento) =>
      new Date(e.event_timestamp / 1000).toISOString().split("T")[0]
  );
  return {
    valores: Object.entries(gruposPorFecha).map(([fecha, eventos]) => {
      return {
        fecha: fecha,
        numero: eventos ? eventos.length : 0,
      };
    }),
  };
}

export function origenDeVisitas(eventos: EventoConGeo[]) {
  const gruposGeograficos = Object.groupBy(
    eventos,
    (e: EventoConGeo) => e.geo.country
  );
  return Object.fromEntries(
    Object.entries(gruposGeograficos).map(([pais, eventos]) => [
      pais,
      eventos ? eventos.length : 0,
    ])
  );
}

export const mejores3Geo = (eventos: EventoConGeo[]) => {
  const gruposPorPais = Object.groupBy(
    eventos,
    (e: EventoConGeo) => e.geo.country
  );
  const mejores3 = Object.entries(gruposPorPais)
    .map(([pais, eventos]) => {
      return {
        pais: pais,
        valores: eventos?.length || 0,
      };
    })
    .sort((a, b) => b.valores - a.valores)
    .slice(0, 3);
  const total = mejores3.reduce((ac, v) => ac + v.valores, 0);
  return mejores3.map((d, i) => {
    return {
      pais: d.pais,
      valor: total == 0 ? 100 : (d.valores / total) * 100,
      fill: `hsl(var(--chart-${i + 1}))`,
    };
  });
};

export const productosMasVistos = (eventos: EventoDeProducto[]) => {
  const grupoPorNombreDeProducto = Object.groupBy(
    eventos,
    (producto) => producto.items[0].item_id
  );
  const valores = new Set<number>();

  const entradas = Object.entries(grupoPorNombreDeProducto).map((entrada) => {
    const eventos = entrada[1];
    if (eventos && eventos.length > 0) {
      const valor = eventos.length;
      if (!valores.has(valor)) {
        valores.add(valor);
        return {
          nombre: eventos[0].items[0].item_name,
          valor,
        };
      }
    }
    return null;
  }).filter(Boolean);
  return entradas;
};

export const tiempoPromedioDeImpresion = (eventos: Evento[]) => {
  const tiempos = eventos
    .map((e) => e.event_params?.find((p) => p.key === "engagement_time_msec")?.value.int_value)
    .filter((tiempo): tiempo is number => tiempo !== undefined && tiempo !== null);

  return tiempos.length > 0
    ? Math.round(tiempos.reduce((ac, t) => ac + t, 0) / tiempos.length / 1000)
    : 0;
};

export const agruparPorSemana = (valores: PuntoEnElTiempo[]) => {
  const agrupado: { [key: string]: { semana: number; año: number; numero: number; count: number } } = {}
  valores.forEach((entrada) => {
    const [año, mes, dia] = entrada.fecha.split('-').map(Number)
    const semana = obtenerNumeroDeSemana(`${año}-${mes}-${dia}`)
    const llave = `${año}-S${semana.toString().padStart(2, '0')}`

    if (!agrupado[llave]) {
      agrupado[llave] = { semana, año, numero: 0, count: 0 }
    }

    agrupado[llave].numero += entrada.numero
    agrupado[llave].count += 1
  })

  return Object.entries(agrupado).map(([llave, { numero, count }]) => ({
    fecha: llave,
    numero,
    promedio: Math.round(numero / count)
  }))
}

export const relacionDeCarritoYCompras = ({ inicioDeCompra, finDeCompra }: {
  inicioDeCompra: EventoDeProducto[],
  finDeCompra: EventoDeProducto[]
}) => {
  const gruposDeInicio = agruparPorSemana(aSerieDeTiempo(inicioDeCompra).valores);
  const gruposDeFin = agruparPorSemana(aSerieDeTiempo(finDeCompra).valores);
  const fusionDeGrupos = gruposDeInicio
    .map((inicio) => {
      const fin = gruposDeFin.find(f => f.fecha === inicio.fecha);
      if (fin) {
        return {
          fecha: inicio.fecha,
          inicioNumero: inicio.numero,
          inicioPromedio: inicio.promedio,
          finNumero: fin.numero,
          finPromedio: fin.promedio
        };
      }
      return null;
    })
    .filter(Boolean);

  return fusionDeGrupos;
};

export const productoMasVendido = (eventos: EventoDeProducto[]) => {
  const productosDeTodasLasCompras = eventos.map((e) => e.items).reduce((ac, productos) => ac.concat(productos), [])
  const grupoPorNombreDeProducto = Object.groupBy(
    productosDeTodasLasCompras,
    (producto) => producto.item_id
  );
  const valores = new Set<number>();
  const entradas = Object
    .entries(grupoPorNombreDeProducto)
    .map((entrada) => {
      const productos = entrada[1]
      if (productos && productos.length > 0) {
        const valor = productos.length;
        if (!valores.has(valor)) {
          valores.add(valor);
          return {
            nombre: productos[0].item_name,
            valor,
          };
        }
      }
      return null;
    })
    .filter((v): v is { nombre: string; valor: number } => v !== undefined && v !== null)
    .sort((a, b) => b.valor - a.valor);
  return entradas;
}

export const productosVendidos = (eventos: EventoDeProducto[]) => {
  const productosPorFecha = eventos.flatMap((e) => {
    const grupoPorIdDeProducto = Object.groupBy(e.items, (producto) => producto.item_id);

    return Object.entries(grupoPorIdDeProducto).map(([_, productos]) => {
      if (productos && productos.length > 0) {
        const fecha = new Date(e.event_timestamp / 1000).toISOString().split("T")[0];
        return {
          fecha,
          nombre: productos[0].item_name,
          numero: productos.length
        };
      }
      return null
    }).filter((p): p is {
      fecha: string,
      nombre: string,
      numero: number
    } => p !== undefined && p !== null);
  });

  const gruposPorFecha = Object.groupBy(productosPorFecha.filter(Boolean), (p) => p!.fecha);

  const resultado = Object.entries(gruposPorFecha).map(([fecha, productos]) => {
    if (productos) {
      const numeroTotal = productos.reduce((total, producto) => total + producto.numero, 0);
      return {
        fecha,
        numero: numeroTotal
      };
    }
    return null
  });

  return { valores: resultado };
};
