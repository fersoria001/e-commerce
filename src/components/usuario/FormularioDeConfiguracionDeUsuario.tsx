"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRef } from "react"
import { Camera } from "lucide-react"
import Image from "next/image"
import { subirImagen } from "@/lib/actions"
import { Claims } from "@auth0/nextjs-auth0"

const esquemaDeConfiguracionDeUsuario = z.object({
    foto: z
        .string({ message: "Subí una foto" }),
    nombres: z
        .string()
        .min(5, {
            message: "Debes proporcionar al menos un nombre y un apellido, ambos con al menos 2 caracteres",
        })
        .refine((value) => {
            const parts = value.trim().split(/\s+/);
            return parts.length >= 2 && parts[0].length >= 2 && parts[parts.length - 1].length >= 2;
        }, {
            message: "Debes proporcionar al menos un nombre y un apellido, ambos con al menos 2 caracteres",
        }),
})

export function FormularioDeConfiguracionDeUsuario({ usuario }: { usuario: Claims | undefined }) {
    const refDeEntradaDeArchivo = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof esquemaDeConfiguracionDeUsuario>>({
        resolver: zodResolver(esquemaDeConfiguracionDeUsuario),
        defaultValues: {
            foto: usuario?.picture || "",
            nombres: usuario?.name || "",
        },
    })
    const manejarSubirFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const archivo = event.target.files?.[0]
        if (archivo) {
            const datos = new FormData();
            datos.append("source", archivo);
            const urlDeImagen = await subirImagen(datos)
            form.setValue("foto", urlDeImagen.datos)
        }
    }
    async function alEnviar(values: z.infer<typeof esquemaDeConfiguracionDeUsuario>) {
        const respuesta = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/organizacion/usuario/${usuario?.sub}`, {
            method: "PATCH",
            body: JSON.stringify({
                picture: encodeURI(values.foto),
                name: values.nombres
            })
        })
        const datos = await respuesta.json()
        console.log(datos)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="foto"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center space-y-4">
                            <FormLabel>Foto de perfil</FormLabel>
                            <FormControl>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => refDeEntradaDeArchivo.current?.click()}
                                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 text-gray-600 relative"
                                    >
                                        {field.value ? (
                                            <Image
                                                src={field.value}
                                                alt="Vista previa de la foto de perfil"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <Camera className="w-1/3 h-1/3" />
                                        )}
                                    </Button>
                                    <input
                                        type="file"
                                        ref={refDeEntradaDeArchivo}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={manejarSubirFoto}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre y apellido</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ingresá tu nombre, segundo nombre (si tenés) y apellido."
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Guardar cambios</Button>
            </form>
        </Form>
    )
}