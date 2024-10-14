'use client'

import { Producto } from "@/types/types"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import Image from "next/image"
export function Sugerencias({ productos }: {
    productos: Producto[]
}) {
    return (
        <div className="w-full mx-auto px-[3rem] py-8">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 2000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true
                    }),
                ]}
                opts={{
                    align: 'start',
                    loop: true,
                    skipSnaps: false,
                    dragFree: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {productos.map((producto) => (
                        <CarouselItem key={producto._id.toString()} className="pl-4 basis-full md:basis-1/3 lg:basis-1/4">
                            <Card className="h-[200px] overflow-hidden">
                                <a href={`/producto?id=${producto._id.toString()}`}>
                                    <CardContent className="flex flex-col items-center h-full p-4">
                                        <div className="flex shrink-0 relative w-[100px] h-[100px] bg-white overflow-hidden rounded-3xl mb-2">
                                            <Image
                                                src={producto.imgs[0]}
                                                alt={producto.descripcion}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <h3 className="text-center text-lg font-semibold text-ellipsis overflow-hidden mb-2">{producto.nombre}</h3>
                                        <h2 className="text-center">Precio: ${producto.precio.precio}</h2>
                                    </CardContent>
                                </a>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-10 sm:-left-[3rem]" />
                <CarouselNext className="absolute -right-10 sm:-right-[3rem]" />
            </Carousel>
        </div>
    )
}