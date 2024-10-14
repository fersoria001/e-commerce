'use client'
import { Trash2Icon, Upload } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertaDeError } from "@/components/errores/AlertaDeError";
import { subirImagen } from "@/lib/actions";

export function SubirFoto({ imgs, agregarImg, borrarImg }: {
    imgs: string[],
    agregarImg: (url: string) => void,
    borrarImg: (url: string) => void,
}) {
    const [errores, setErrores] = useState<string[] | undefined>()

    function manejarClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const entrada = document.getElementById("entrada-de-archivo");
        if (entrada) {
            entrada.click();
        }
    }

    useEffect(() => {
        const entrada = document.getElementById('entrada-de-archivo') as HTMLInputElement;
        const subirFoto = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const datos = new FormData();
                datos.append("source", target.files[0]);
                const resultado = await subirImagen(datos)
                if (!resultado.exito) {
                    setErrores([resultado.datos])
                    return
                }
                agregarImg(resultado.datos)
            }
        }
        if (entrada) {
            entrada.addEventListener('change', subirFoto);
        }
        return () => {
            if (entrada) {
                entrada.removeEventListener('change', subirFoto)
            }
        };
    }, [agregarImg])

    return (
        <div>
            {
                imgs.length > 0 ?
                    <span className="relative">
                        <Image
                            alt="Imagen de producto"
                            className="aspect-square w-full rounded-md object-cover"
                            height="300"
                            src={imgs[0]}
                            width="300"
                            priority
                        />
                        <Trash2Icon
                            onClick={() => borrarImg(imgs[0])}
                            className="absolute bottom-1 right-2 bg-white dark:bg-stone-950 p-1 cursor-pointer rounded-md" />
                    </span>
                    : <Image
                        alt="Imagen de producto"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src="/placeholder.svg"
                        width="300"
                        priority
                    />
            }
            <div className="flex mt-2">
                <TooltipProvider>
                    <Tooltip>

                        <Carousel
                            opts={{
                                align: 'start',
                                loop: false,
                                skipSnaps: false,
                                dragFree: false,
                            }}
                            className="w-2/3 me-2"
                        >
                            {
                                imgs.length <= 1 &&
                                <TooltipTrigger>
                                    <CarouselContent className="-ml-2 py-0.5">
                                        <CarouselItem
                                            className="basis-1/2 pl-2 relative cursor-pointer flex justify-center">
                                            <Image
                                                alt="Imagen de producto"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />

                                        </CarouselItem>
                                        <CarouselItem className="basis-1/2 pl-2 relative cursor-pointer flex justify-center">

                                            <Image
                                                alt="Imagen de producto"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />

                                        </CarouselItem>
                                    </CarouselContent>
                                    <TooltipContent>
                                        <p>Desliza para ver las demas fotos</p>
                                    </TooltipContent>
                                </TooltipTrigger>
                            }

                            {
                                imgs.length == 2 &&
                                <TooltipTrigger>
                                    <CarouselContent className="-ml-2 py-0.5">
                                        <CarouselItem
                                            className="basis-1/2 pl-2 relative cursor-pointer flex justify-center">
                                            <Image
                                                alt="Imagen de producto"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src={imgs[1]}
                                                width="84"
                                            />
                                            <Trash2Icon
                                                onClick={() => borrarImg(imgs[1])}
                                                className="absolute bottom-1 right-0 bg-white dark:bg-stone-950 p-1 cursor-pointer rounded-md" />
                                        </CarouselItem>
                                        <CarouselItem className="basis-1/2 pl-2 relative cursor-pointer flex justify-center">

                                            <Image
                                                alt="Imagen de producto"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="84"
                                                src="/placeholder.svg"
                                                width="84"
                                            />

                                        </CarouselItem>
                                    </CarouselContent>
                                    <TooltipContent>
                                        <p>Desliza para ver las demas fotos</p>
                                    </TooltipContent>
                                </TooltipTrigger>
                            }

                            {
                                imgs.length > 2 &&
                                <TooltipTrigger>
                                    <CarouselContent className="-ml-2 py-0.5">
                                        {imgs.map((url, i) => {
                                            if (i > 0)
                                                return (
                                                    <CarouselItem
                                                        key={url}
                                                        className="basis-1/2 pl-2 relative cursor-pointer flex justify-center">

                                                        <Image
                                                            alt="Imagen de producto"
                                                            className="aspect-square w-full rounded-md object-cover"
                                                            height="84"
                                                            src={url}
                                                            width="84"
                                                        />
                                                        <Trash2Icon
                                                            onClick={() => borrarImg(url)}
                                                            className="absolute bottom-1 right-0 bg-white dark:bg-stone-950 p-1 cursor-pointer rounded-md" />
                                                    </CarouselItem>
                                                )
                                        })}
                                    </CarouselContent>
                                    <TooltipContent>
                                        <p>Desliza para ver las demas fotos</p>
                                    </TooltipContent>
                                </TooltipTrigger>
                            }
                        </Carousel >
                    </Tooltip>
                </TooltipProvider>
                <form
                    className="w-1/3" id="upload-img-form">
                    <input className="hidden" name="source" id="entrada-de-archivo" type="file" />
                    <button
                        type="button"
                        onClick={manejarClick}
                        className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Subir</span>
                    </button>
                </form>
            </div>
            {errores && <AlertaDeError errores={errores} />}
        </div>
    )
}