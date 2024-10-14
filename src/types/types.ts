import { FirebaseOptions } from "firebase/app";
import { ObjectId } from "mongodb";
export interface ConfiguracionDeProveedores {
  configuracionDeFirebase: FirebaseOptions;
}
export enum PeriodoEnum {
  Week = "Week",
  Month = "Month",
  Year = "Year",
}

export enum EstadoDePedidoEnum {
  Completados = "complete",
  Vencidos = "expired",
  Abiertos = "open",
}

export enum EmpresasDeEnvios {
  Andreani = "shr_1Q7jiIAsT9f83AEukmP0yjDJ",
  OCA = "shr_1Q7ji4AsT9f83AEuZoiJGKqw",
}

export enum PaisesEnum {
  AR = "Argentina",
  US = "Estados Unidos",
}

export enum EstadoDelProducto {
  ACTIVO = "Activo",
  ARCHIVADO = "Archivado",
}

export enum TipoDeMoneda {
  USD = "usd",
}

export interface Precio {
  idDePrecio?: string;
  moneda: string;
  precio: number;
  stock: number;
  codigo: string;
}

export interface Producto {
  _id: ObjectId;
  categoria: Categoria;
  subCategoria: SubCategoria;
  nombre: string;
  imgs: string[];
  descripcion: string;
  estado: string;
  precio: Precio;
  cantidad?: number;
  lastModified: Date;
  createdAt: Date;
  ventas?: number;
}

export interface SubCategoria {
  _id: ObjectId;
  categoriaId: ObjectId;
  nombre: string;
}

export interface Categoria {
  _id: ObjectId;
  nombre: string;
  subCategorias?: SubCategoria[];
}

export interface MetadatosDeUsuario {
  idDeCliente?: string;
  compras?: number;
}

export interface Usuario {
  email: string;
  picture: string;
  user_id: string;
  family_name: string;
  given_name: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  user_metadata?: MetadatosDeUsuario;
}

export interface ImageResponse {
  status_code: number;
  success: {
    message: string;
    code: number;
  };
  image: {
    name: string;
    extension: string;
    size: number;
    width: number;
    height: number;
    date: string;
    date_gmt: string;
    storage_id: null | string;
    description: null | string;
    nsfw: string;
    md5: string;
    storage: string;
    original_filename: string;
    original_exifdata: null | string;
    views: string;
    id_encoded: string;
    filename: string;
    ratio: number;
    size_formatted: string;
    mime: string;
    bits: number;
    channels: null | string;
    url: string;
    url_viewer: string;
    thumb: {
      filename: string;
      name: string;
      width: number;
      height: number;
      ratio: number;
      size: number;
      size_formatted: string;
      mime: string;
      extension: string;
      bits: number;
      channels: null | string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      width: number;
      height: number;
      ratio: number;
      size: number;
      size_formatted: string;
      mime: string;
      extension: string;
      bits: number;
      channels: null | string;
      url: string;
    };
    views_label: string;
    display_url: string;
    how_long_ago: string;
  };
  status_txt: string;
}

export interface Resultado<T> {
  datos: T | string;
  exito: boolean;
}

export interface Evento {
  event_name: string;
  event_timestamp: number;
  event_params?: ParametroDeEvento[];
}

export interface EventoConGeo extends Evento {
  geo: Geo;
}

export interface EventoDeProducto extends Evento {
  items: {
    item_id: string;
    item_name: string;
    item_category: string;
    item_category2: string;
    item_list_id: string;
  }[];
}

export interface Geo {
  city: string;
  country: string;
  continent: string;
  region: string;
  sub_continent: string;
  metro: string;
}

export interface ParametroDeEvento {
  key: string;
  value: Valor;
}

export interface Valor {
  string_value: string | null;
  int_value: number | null;
  float_value: number | null;
  double_value: number | null;
}

export interface SerieDeTiempo {
  valores: PuntoEnElTiempo[];
}

export interface PuntoEnElTiempo { fecha: string; numero: number }