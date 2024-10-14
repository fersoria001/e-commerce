import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('variable de entorno ínvalida o no disponible: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const opciones = { appName: "pctech.nextjs" };

let promesaDeCliente: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalConMongo = global as typeof globalThis & {
    _clienteMongo?: MongoClient;
  };

  if (!globalConMongo._clienteMongo) {
    globalConMongo._clienteMongo = new MongoClient(uri, opciones);
  }
  promesaDeCliente = globalConMongo._clienteMongo;
} else {
  promesaDeCliente = new MongoClient(uri, opciones);
}

export default promesaDeCliente;