'use client'

import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react";
import './main_banner.css'

export function MainBanner() {
    const [animarIzquierda, setAnimarIzquierda] = useState(false);
    const [animarDerecha, setAnimarDerecha] = useState(false);

    useEffect(() => {
        setAnimarIzquierda(true);
        setTimeout(() => setAnimarDerecha(true), 150);
    }, []);

    return (
        <section id="main-banner" className="relative w-full min-h-screen p-4 flex flex-col sm:flex-row lg:block items-center justify-center gap-4 overflow-hidden">
            <Card
                className={`w-full sm:w-1/2 lg:w-[45%] max-w-sm lg:absolute lg:left-4 lg:top-1/4 entrada-de-tarjeta ${animarIzquierda ? 'tarjeta-visible' : ''}`}>
                <CardHeader className={`${animarIzquierda ? "entrada-de-cabecera-de-tarjeta" : ""}`}>
                    <CardTitle className="text-lg sm:text-xl">
                        ¡Ofertas imperdibles!
                    </CardTitle>
                    <CardDescription className="text-sm">Los mejores gadgets al mejor precio</CardDescription>
                </CardHeader>
                <CardContent className={`${animarIzquierda ? "entrada-de-contenido-de-tarjeta" : ""}`}>
                    <div className="relative h-[80px] w-[80px] sm:h-[100px] sm:w-[100px]">
                        <Image
                            src="/headphones1.png"
                            alt="Imagen de auriculares"
                            fill
                            className="object-contain"
                        />
                    </div>
                </CardContent>
                <CardFooter className={`${animarIzquierda ? "entrada-de-pie-de-tarjeta" : ""}`}>
                    <p className="text-sm">¡Compra ahora y ahorra!</p>
                </CardFooter>
            </Card>
            <Card
                className={`w-full sm:w-1/2 lg:w-[45%] max-w-sm lg:absolute lg:right-4 lg:bottom-1/4 entrada-de-tarjeta ${animarDerecha ? 'tarjeta-visible' : ''}`}>
                <CardHeader className={`${animarDerecha ? "entrada-de-cabecera-de-tarjeta-derecha" : ""}`}>
                    <CardTitle className="text-lg sm:text-xl">
                        Tecnología de vanguardia
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Rendimiento y calidad en cada compra
                    </CardDescription>
                </CardHeader>
                <CardContent className={`${animarDerecha ? "entrada-de-contenido-de-tarjeta-derecha" : ""}`}>
                    <div className="relative h-[80px] w-[80px] sm:h-[100px] sm:w-[100px]">
                        <Image
                            src="/gpuamd1.png"
                            alt="Imagen de GPU AMD"
                            fill
                            className="object-contain"
                        />
                    </div>
                </CardContent>
                <CardFooter className={`${animarDerecha ? "entrada-de-pie-de-tarjeta-derecha" : ""}`}>
                    <p className="text-sm">¡No te lo pierdas!</p>
                </CardFooter>
            </Card>
        </section>
    )
}