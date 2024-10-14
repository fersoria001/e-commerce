import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export default function EsqueletoDeProducto() {
  return (
    <Card className="flex flex-col md:flex-row">
      <CardHeader className="w-full flex flex-col p-2.5 md:max-w-xs lg:max-w-md xl:max-w-xl self-center">
        <Skeleton className="w-full h-[240px] lg:h-[400px] rounded-3xl mb-4" />
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
            {[...Array(4)].map((_, i) => (
              <CarouselItem
                key={`imgSliderSkeleton_${i}`}
                className="w-full md:basis-1/2 lg:basis-1/3 pl-4 relative"
              >
                <Card className="border-none">
                  <CardContent className="flex relative h-[100px] overflow-hidden rounded-3xl">
                    <Skeleton className="w-full h-full" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-0" />
          <CarouselNext className="-right-0" />
        </Carousel>
      </CardHeader>
      <CardContent className="w-full flex flex-col px-4 mt-4">
        <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        <div className="flex flex-col mt-auto self-end xl:mr-8">
          <div className="flex space-x-2 mb-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-10 w-40 self-end" />
        </div>
        <div className="mt-auto mb-4">
          <Skeleton className="h-6 w-20 mb-4" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}