"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Claims } from "@auth0/nextjs-auth0"

const esquemaDeConfiguracionDeSeguridadDeUsuario = z.object({
    nuevaContraseña: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
        ),
    confirmarContraseña: z.string()
}).superRefine((data, ctx) => {
    if (data.nuevaContraseña !== data.confirmarContraseña) {
        ctx.addIssue({
            code: 'custom',
            path: ['confirmarContraseña'],
            message: 'Las contraseñas no coinciden',
        });
    }
});

export function FormularioDeConfiguracionDeSeguridadUsuario({ usuario }: { usuario: Claims | undefined }) {
    const form = useForm<z.infer<typeof esquemaDeConfiguracionDeSeguridadDeUsuario>>({
        resolver: zodResolver(esquemaDeConfiguracionDeSeguridadDeUsuario),
        defaultValues: {
            nuevaContraseña: "",
            confirmarContraseña: "",
        },
    })
    function alEnviar(values: z.infer<typeof esquemaDeConfiguracionDeSeguridadDeUsuario>) {
        console.log(usuario?.sub)
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(alEnviar)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="nuevaContraseña"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nueva contraseña</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ingresá una contraseña nueva"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmarContraseña"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmar contraseña</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ingresa la contraseña nuevamente"
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