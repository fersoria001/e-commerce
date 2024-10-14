'use client'

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";


export function DeslizadorDeImagenes({ imgs, setImgActiva }: {
    imgs: string[]
    setImgActiva: (url: string) => void
}
) {
    return (
        <Carousel
            opts={{
                align: 'start',
                loop: false,
                skipSnaps: false,
                dragFree: false,
            }}
            className="w-full self-center px-10"
        >
            <CarouselContent className="-ml-4">
                {imgs.map((img, i) => (
                    <CarouselItem
                        key={`imgSliderImg_${i}`}
                        className="w-full md:basis-1/2 lg:basis-1/3 pl-4 relative cursor-pointer">
                        <Card className="overflow-hidden bg-white dark:bg-white rounded-3xl" onClick={() => setImgActiva(img)}>
                            <CardContent className="flex relative h-[100px]">
                                <Image
                                    fill
                                    src={img}
                                    alt="Current Image"
                                    className="object-contain"
                                />
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="-left-0" />
            <CarouselNext className="-right-0" />
        </Carousel>
    )
}