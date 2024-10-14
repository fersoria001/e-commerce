import { Skeleton } from "@/components/ui/skeleton"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function EsqueletoDeSugerencias() {
  return (
    <div className="w-full mx-auto px-[3rem] py-8">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {[...Array(4)].map((_, index) => (
            <CarouselItem key={index} className="pl-4 basis-full md:basis-1/3 lg:basis-1/4">
              <Card className="h-[200px] overflow-hidden">
                <CardContent className="flex flex-col items-center h-full p-4">
                  <Skeleton className="w-[100px] h-[100px] rounded-3xl mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
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