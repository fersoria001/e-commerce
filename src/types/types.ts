export enum EmpresasDeEnvios {
    ANDREANI = "Andreani",
    OCA = "OCA"
  }
  
  export type Direccion = {
    direccion: string;
    ciudad: string;
    provincia: string;
    pais: string;
    cp: string;
  }
  
  export type Envio = {
    empresa?: EmpresasDeEnvios;
    direccion?: Direccion;
    costo?: number;
  }
  
  export type Product = {
    id: string;
    categoria: string;
    nombre: string;
    thumbnail: string;
    imgs: string[];
    descripcion: string;
    precio: number;
    priceId: string;
    cantidad?: number;
  }