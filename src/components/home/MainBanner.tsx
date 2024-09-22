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
    const [animateLeft, setAnimateLeft] = useState(false);
    const [animateRight, setAnimateRight] = useState(false);
    useEffect(() => {
        setAnimateLeft(true);
        setTimeout(() => setAnimateRight(true), 150);
    }, []);
    return (
        <section id="main-banner">
            <div className="left">
                <Card
                    className={`absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] w-[90%] md:w-fit min-h-fit
                        md:transform-none md:left-4 md:bottom-0
                      z-10  bottom-0 lg:bottom-10 card-enter ${animateLeft ? 'card-visible' : ''}`}>
                    <CardHeader className={`${animateLeft ? "card-header-enter" : ""}`}>
                        <CardTitle>
                            ¡Ofertas imperdibles!
                        </CardTitle>
                        <CardDescription>Los mejores gadgets al mejor precio</CardDescription>
                    </CardHeader>
                    <CardContent className={`${animateLeft ? "card-content-enter" : ""}`}>
                        <div className="relative h-[100px] w-[100px]">
                            <Image
                                src={"/headphones1.png"}
                                alt="Imagen de auriculares"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className={`${animateLeft ? "card-footer-enter" : ""}`}>
                        <p>¡Compra ahora y ahorra!</p>
                    </CardFooter>
                </Card>
                <Card
                    className={`hidden md:block absolute
                    top-20 right-2
                     z-10 xl:top-1/4 card-enter ${animateRight ? 'card-visible' : ''}`}>
                    <CardHeader className={`${animateRight ? "card-header-enter-right" : ""}`}>
                        <CardTitle>
                            Tecnología de vanguardia
                        </CardTitle>
                        <CardDescription>
                            Rendimiento y calidad en cada compra
                        </CardDescription>
                    </CardHeader>
                    <CardContent className={`${animateRight ? "card-content-enter-right" : ""}`}>
                        <div className="relative h-[100px] w-[100px]">
                            <Image
                                src={"/gpuamd1.png"}
                                alt="Imagen de GPU AMD"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className={`${animateRight ? "card-footer-enter-right" : ""}`}>
                        <p>¡No te lo pierdas!</p>
                    </CardFooter>
                </Card>
                <div className="right h-[100vh]">
                </div>
            </div>
        </section>
    )
}