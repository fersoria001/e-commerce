'use client'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Product } from "@/types/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from 'embla-carousel-autoplay'


export default function ProductCarousel({ products }: { products: Product[] }) {
    return (
        <div className="w-full mx-auto px-[3rem] sm:px-16 py-4">
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
                    {products.map((product) => (
                        <CarouselItem key={product.id} className="pl-4 basis-full lg:basis-1/2">
                            <Card className="h-[200px] overflow-hidden">
                                <Link href={`/producto?id=${product.id}`}>
                                    <CardContent className="flex flex-col items-center h-full p-4">
                                        <div className="relative w-[160px] h-[160px]">
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.descripcion}
                                                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold truncate">{product.nombre}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-3">{product.descripcion}</p>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-10 sm:-left-[3rem]">
                    <ChevronLeft className="h-4 w-4" />
                </CarouselPrevious>
                <CarouselNext className="absolute -right-10 sm:-right-[3rem]">
                    <ChevronRight className="h-4 w-4" />
                </CarouselNext>
            </Carousel>
        </div>
    )
}