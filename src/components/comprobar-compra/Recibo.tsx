'use client'
import { useDimensionesDeVentana } from "@/hooks/useDimensionesDeVentana";
import { EmpresasDeEnvios, PaisesEnum, Producto } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Stripe from "stripe";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
    productos: Producto[],
    envio: {
        detalles: Stripe.Checkout.Session.ShippingDetails | null,
        costo: Stripe.Checkout.Session.ShippingCost | null
    }
}

export function Recibo({ productos, envio }: Props) {
    const [mostrarDetalles, setMostrarDetalles] = useState<boolean>(false)
    const { ancho } = useDimensionesDeVentana()
    const calcularSubTotal = () => {
        const costoDeProductos = productos.reduce((ac, obj) => ac + obj.precio.precio, 0)
        const costoDeEnvio = ((envio.costo?.amount_total || 0) / 100)
        return costoDeProductos + costoDeEnvio
    }
    const llaveDeEnvio = (idDeEnvio: string): keyof typeof EmpresasDeEnvios => {
        const valor = idDeEnvio as EmpresasDeEnvios
        switch (valor) {
            case EmpresasDeEnvios.Andreani:
                return "Andreani"
            case EmpresasDeEnvios.OCA:
                return "OCA"
            default:
                const _exhaustiveCheck: never = valor;
                return _exhaustiveCheck;
        }
    }
    const imagenDeEnvio = (idDeEnvio: string) => {
        const valor = idDeEnvio as EmpresasDeEnvios
        switch (valor) {
            case EmpresasDeEnvios.Andreani:
                return "/andreani.png"
            case EmpresasDeEnvios.OCA:
                return "/oca.png"
            default:
                const _exhaustiveCheck: never = valor;
                return _exhaustiveCheck;
        }
    }
    return (
        <Card className="flex flex-col rounded-3xl w-full max-w-sm mx-auto lg:max-w-lg border-stone-350 h-[calc(100vh-2rem)] my-4">
            <CardContent className="flex flex-col h-full p-4">
                {productos.length > 1 ? (
                    <>
                        <div className={cn("flex items-center mb-4", {
                            "hidden": mostrarDetalles || ancho > 768
                        })}>
                            <div className="w-10 h-10 mr-4">
                                <Image
                                    src={productos[0].imgs[0]}
                                    alt={productos[0].nombre}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div>
                                <h1 className="text-left font-semibold text-sm text-muted-foreground">
                                    Subtotal
                                </h1>
                                <h1 className="text-left text-2xl font-semibold text-primary">
                                    ${calcularSubTotal()}
                                </h1>
                                <Button
                                    onClick={() => setMostrarDetalles(true)}
                                    className="mt-2 text-sm font-semibold rounded-full"
                                >
                                    Ver detalles
                                </Button>
                            </div>
                        </div>
                        <ScrollArea className={cn("flex-grow mb-4", {
                            "hidden": ancho <= 768 && !mostrarDetalles,
                            "flex flex-col": ancho > 768 || mostrarDetalles
                        })}>
                            <div className="space-y-4">
                                {productos.map((p) => (
                                    <div className="flex items-center" key={p._id.toString()}>
                                        <div className="w-10 h-10 mr-4 flex-shrink-0">
                                            <Image
                                                src={p.imgs[0]}
                                                alt={p.descripcion}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between">
                                                <h1 className="text-sm font-semibold text-primary">{p.nombre}</h1>
                                                <h1 className="text-sm font-bold text-primary">${p.precio.precio}</h1>
                                            </div>
                                            <h2 className="text-left text-xs text-muted-foreground">{p.descripcion}</h2>
                                        </div>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex items-center">
                                    <div className="w-10 h-10 mr-4 flex-shrink-0">
                                        <Image
                                            src={imagenDeEnvio(envio.costo!.shipping_rate!.toString())}
                                            alt="envio service logo"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between">
                                            <h1 className="text-sm font-semibold text-primary">
                                                {llaveDeEnvio(envio.costo!.shipping_rate!.toString())}
                                            </h1>
                                            <h1 className="text-sm font-bold text-primary">
                                                ${(envio.costo?.amount_total || 0) / 100}
                                            </h1>
                                        </div>
                                        <h2 className="text-left text-xs text-muted-foreground">
                                            Envío a: {envio.detalles?.name}
                                        </h2>
                                        <h2 className="text-left text-xs text-muted-foreground">
                                            Dirección: {envio.detalles?.address?.line1} {envio.detalles?.address?.line2}, {envio.detalles?.address?.city},
                                            {envio.detalles?.address?.state}, {envio.detalles?.address?.postal_code}.
                                            {PaisesEnum[envio.detalles?.address?.country as keyof typeof PaisesEnum]}.
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        {ancho <= 768 && mostrarDetalles && (
                            <Button
                                onClick={() => setMostrarDetalles(false)}
                                className="w-full text-sm font-semibold rounded-full mb-4"
                            >
                                Ocultar detalles
                            </Button>
                        )}
                    </>
                ) : (
                    <ScrollArea className="flex-grow mb-4">
                        <div className="space-y-4">
                            {productos.map((p) => (
                                <div className="flex items-center" key={p._id.toString()}>
                                    <div className="w-10 h-10 mr-4 flex-shrink-0 lg:w-20 lg:h-20">
                                        <Image
                                            src={p.imgs[0]}
                                            alt={p.nombre}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h1 className="text-left font-semibold text-md text-muted-foreground">{p.nombre}</h1>
                                        <h1 className="text-left text-2xl text-primary">${p.precio.precio}</h1>
                                        <h2 className="text-left font-semibold text-sm text-muted-foreground">{p.descripcion}</h2>
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex items-center">
                                <div className="w-10 h-10 mr-4 flex-shrink-0">
                                    <Image
                                        src={imagenDeEnvio(envio.costo!.shipping_rate!.toString())}
                                        alt="envio service logo"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <h1 className="text-sm font-semibold text-primary">
                                            {llaveDeEnvio(envio.costo!.shipping_rate!.toString())}
                                        </h1>
                                        <h1 className="text-sm font-bold text-primary">
                                            ${(envio.costo?.amount_total || 0) / 100}
                                        </h1>
                                    </div>
                                    <h2 className="text-left text-xs text-muted-foreground">
                                        Envío a: {envio.detalles?.name}
                                    </h2>
                                    <h2 className="text-left text-xs text-muted-foreground">
                                        Dirección: {envio.detalles?.address?.line1} {envio.detalles?.address?.line2}, {envio.detalles?.address?.city},
                                        {envio.detalles?.address?.state}, {envio.detalles?.address?.postal_code}.
                                        {PaisesEnum[envio.detalles?.address?.country as keyof typeof PaisesEnum]}.
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                )}
                <Separator className="mt-auto" />
                <div className="flex py-2 items-center justify-between">
                    <h1 className="text-left font-semibold text-sm text-muted-foreground">Total:</h1>
                    <h1 className="text-left text-3xl text-primary lg:text-4xl">${calcularSubTotal()}</h1>
                </div>
                <div className="mt-4">
                    <Link href="/" passHref>
                        <Button className="w-full py-2 rounded-full bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-600
                        dark:text-white text-white font-semibold">
                            Continuar
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}