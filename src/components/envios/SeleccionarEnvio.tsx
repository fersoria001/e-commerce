'use client'
import { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../carrito/Carrito";
import Image from "next/image";
import { Direccion, EmpresasDeEnvios, Envio } from "@/types/types";
import clsx from "clsx";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ErrorAlert } from "../errors/ErrorAlert";

const distancia = Math.floor(Math.random() * (1500 - 100 + 1) + 100);
const dias = Math.floor(Math.random() * (15 - 4 + 1) + 4);
const diferencia = Math.floor(Math.random() * (5 - 1 + 1) + 1);

const direccionSchema = z.object({
    direccion: z.string().min(3, { message: "Escribi el nombre de la calle en donde vivis y el numero, si no tiene numero escribi S/N" }),
    ciudad: z.string().min(3, { message: "Escribi el nombre de la ciudad en donde vivis" }),
    provincia: z.string().min(3, { message: "Escribi el nombre de la provincia en donde se encuentra tu ciudad" }),
    pais: z.string().min(3, { message: "Escribi el pais en donde se encuentra tu provincia" }),
    cp: z.string().min(3, { message: "Escribi el codigo postal de tu zona" })
})
type DireccionErrorType = z.inferFlattenedErrors<typeof direccionSchema>

export function SeleccionarEnvio() {
    const { productos, agregarEnvio } = useContext(CarritoContext)
    const { width } = useWindowDimensions()
    const [mostrarDetalles, setMostrarDetalles] = useState<boolean>(false)
    const [empresaDeEnvio, setEmpresaDeEnvio] = useState<EmpresasDeEnvios>(EmpresasDeEnvios.ANDREANI)
    const [direccion, setDireccion] = useState<Direccion>({
        direccion: "",
        ciudad: "",
        provincia: "",
        pais: "",
        cp: "",
    })
    const [costoDeEnvio, setCostoDeEnvio] = useState<number>(0)
    const [tiempoDeEnvio, setTiempoDeEnvio] = useState<number | undefined>()
    const [errors, setErrors] = useState<DireccionErrorType>()
    const router = useRouter()
    function calcularCostoDeEnvio(empresa: EmpresasDeEnvios) {
        const costoBasePorKm = empresa === EmpresasDeEnvios.ANDREANI ? 6 : 4
        return costoBasePorKm * distancia
    }
    function calcularTiempoDeEnvio(empresa: EmpresasDeEnvios) {
        switch (empresa) {
            case EmpresasDeEnvios.ANDREANI:
                return dias + diferencia
            case EmpresasDeEnvios.OCA:
                return dias
            default:
                const _exhaustiveCheck: never = empresa
                return _exhaustiveCheck
        }
    }
    function calcularSubTotal() {
        return productos.reduce((acc, obj) => acc + obj.precio, 0)
    }
    function submitForm(e: React.FormEvent) {
        e.preventDefault()
        const { data, error, success } = direccionSchema.safeParse(direccion)
        if (!success) {
            return setErrors(error.flatten())
        }
        const envio: Envio = {
            empresa: empresaDeEnvio,
            direccion: data,
            costo: costoDeEnvio
        }
        agregarEnvio(envio)
        return router.push("/comprar")
    }
    useEffect(() => {
        const { success } = direccionSchema.safeParse(direccion)
        if (success) {
            setCostoDeEnvio(calcularCostoDeEnvio(empresaDeEnvio))
            setTiempoDeEnvio(calcularTiempoDeEnvio(empresaDeEnvio))
        }
    }, [direccion, empresaDeEnvio])
    return (
        <div className="flex flex-col lg:flex-row rounded-3xl w-full max-w-sm mx-auto lg:max-w-fit justify-center">
            {
                productos.length > 1 ?
                    <>
                        <div className={clsx("flex py-6 ml-4", {
                            "hidden": mostrarDetalles || width > 768
                        })}>
                            <div className="max-w-[40px] max-h-[40px] mr-4">
                                <Image
                                    src={productos[0].thumbnail}
                                    alt={productos[0].nombre}
                                    sizes="100vw"
                                    width={300}
                                    height={300}
                                    className="w-full h-auto rounded-3xl"
                                />
                            </div>
                            <div>
                                <h1 className="text-left font-semibold text-sm text-stone-400 pb-1">
                                    Subtotal
                                </h1>
                                <h1 className="text-left text-2xl font-semibold text-white pb-1">
                                    ${calcularSubTotal()}
                                </h1>
                                <button
                                    onClick={() => setMostrarDetalles(true)}
                                    className="flex bg-stone-800 rounded-3xl py-3 px-2.5">
                                    <p className="font-semibold text-sm">Ver detalles</p>
                                    <p className="ml-2 text-sm">V</p>
                                </button>
                            </div>
                        </div>
                        <div className={clsx("px-4 transition-all duration-500 ease-in-out", {
                            "max-h-0 invisible": width <= 768 && !mostrarDetalles,
                            "max-h-[500px] flex flex-col overflow-y-auto pb-8": width <= 768 && mostrarDetalles,
                            "max-h-[500px] flex flex-col overflow-y-auto py-8 max-w-lg px-[4.5rem]": width > 768
                        })}>
                            <div className="mb-4">
                                <h1 className="text-left font-semibold text-sm text-stone-400 pb-1">Subtotal</h1>
                                <h1 className="text-left text-3xl text-white pb-1 lg:text-4xl lg:pb-0">${calcularSubTotal()}</h1>
                            </div>
                            {
                                productos.map((p) => {
                                    return (
                                        <div className="flex mb-6 w-full" key={p.id}>
                                            <div className="max-w-[40px] max-h-[40px] mr-4">
                                                <Image
                                                    src={p.thumbnail}
                                                    alt={p.nombre}
                                                    sizes="100vw"
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-auto rounded-3xl"
                                                />
                                            </div>
                                            <div className="mt-2 w-full lg:mt-auto">
                                                <div className="flex justify-between">
                                                    <h1 className="text-sm font-semibold text-white">{p.nombre}</h1>
                                                    <h1 className="text-sm font-bold text-white">${p.precio}</h1>
                                                </div>
                                                <h2 className="text-left text-xs text-stone-400">{p.descripcion}</h2>
                                            </div>

                                        </div>

                                    )
                                })
                            }
                            <div className={clsx("ml-[50px]", {
                                "block": width <= 768,
                                "hidden": width > 768
                            })}>
                                <div className="h-[0.5px] bg-gray-200 mb-4"></div>
                                <div className="flex justify-between mb-12 font-semibold text-sm">
                                    <label>Total:</label>
                                    <p>${calcularSubTotal()}</p>
                                </div>
                                <button
                                    onClick={() => setMostrarDetalles(false)}
                                    className="flex bg-stone-900 rounded-3xl py-3 px-2.5 max-w-fit">
                                    <p className="font-semibold text-sm">Ocultar detalles</p>
                                    <p className="ml-2 text-sm">^</p>
                                </button>
                            </div>
                        </div>
                    </>
                    :
                    <div className="flex flex-col items-center py-6 px-4 lg:px-[4.5rem]">
                        {
                            productos.map((p) => {
                                return (
                                    <div className="flex lg:flex-col-reverse" key={p.id}>
                                        <div className="max-w-[40px] max-h-[40px] mt-2 mr-4 lg:max-w-[250px] lg:max-h-[250px]">
                                            <Image
                                                src={p.thumbnail}
                                                alt={p.nombre}
                                                sizes="100vw"
                                                width={300}
                                                height={300}
                                                className="w-full h-auto rounded-3xl"
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-left font-semibold text-md text-stone-400 pb-1">{p.nombre}</h1>
                                            <h1 className="text-left text-3xl text-white pb-1">${p.precio}</h1>
                                            <h2 className="text-left font-semibold text-sm text-stone-400">{p.descripcion}</h2>
                                        </div>
                                    </div>

                                )
                            })
                        }

                    </div>}
            <form
                onSubmit={submitForm}
                className={clsx("flex flex-col bg-white rounded-3xl p-4 shrink-0 max-w-md", {
                    "p-8": width > 768
                })}>
                <h1 className="text-stone-900 mb-4 text-xl font-medium">Detalles de envío</h1>
                <div className="flex flex-col mb-2">
                    <label
                        htmlFor="empresa"
                        className="text-stone-600 mb-1 text-sm">
                        Empresa de envio
                    </label>
                    <select
                        id="empresa"
                        name="empresa"
                        value={empresaDeEnvio}
                        onChange={(e) => setEmpresaDeEnvio(e.currentTarget.value as EmpresasDeEnvios)}
                        className="text-stone-600 p-1.5 border shadow-sm rounded-3xl focus:outline-blue-300">
                        {
                            Object.keys(EmpresasDeEnvios).map(k =>
                                <option key={k}>
                                    {EmpresasDeEnvios[k as keyof typeof EmpresasDeEnvios]}
                                </option>
                            )
                        }
                    </select>
                </div>
                <div className="flex flex-col mb-2">
                    <label
                        htmlFor="direccion"
                        className="text-stone-600 mb-1 text-sm">
                        Calle y número
                    </label>
                    <input
                        onChange={(e) => setDireccion(p => { return { ...p, direccion: e.target.value } })}
                        id="direccion"
                        name="direccion"
                        className="w-full text-stone-600 p-1.5 border shadow-sm rounded-3xl focus:outline-blue-300" />
                    {errors && errors.fieldErrors.direccion && <ErrorAlert errors={errors.fieldErrors.direccion} />}
                </div>
                <div className="mb-2 w-full">
                    <div className="flex">
                        <span className="w-1/2">
                            <label
                                htmlFor="ciudad"
                                className="text-stone-600 mb-1 text-sm">
                                Ciudad
                            </label>
                        </span>
                        <span className="w-1/2">
                            <label
                                htmlFor="provincia"
                                className="text-stone-600 mb-1 text-sm">
                                Provincia
                            </label>
                        </span>
                    </div>
                    <div className="flex">
                        <input
                            onChange={(e) => setDireccion(p => { return { ...p, ciudad: e.target.value } })}
                            id="ciudad"
                            name="ciudad"
                            className="w-full text-stone-600 p-1.5 rounded-bl-3xl border focus:outline-blue-300" />
                        <input
                            onChange={(e) => setDireccion(p => { return { ...p, provincia: e.target.value } })}
                            id="provincia"
                            name="provincia"
                            className="w-full text-stone-600 p-1.5 rounded-br-3xl border focus:outline-blue-300" />
                    </div>
                    {errors && errors.fieldErrors.ciudad && <ErrorAlert errors={errors.fieldErrors.ciudad} />}
                    {errors && errors.fieldErrors.provincia && <ErrorAlert errors={errors.fieldErrors.provincia} />}
                </div>
                <div className="flex flex-col mb-4">
                    <label
                        htmlFor="pais"
                        className="text-stone-600 mb-1 text-sm">
                        Pais
                    </label>
                    <input
                        onChange={(e) => setDireccion(p => { return { ...p, pais: e.target.value } })}
                        id="pais"
                        name="pais"
                        className="w-full text-stone-600 p-1.5 border shadow-sm rounded-3xl focus:outline-blue-300" />
                    {errors && errors.fieldErrors.pais && <ErrorAlert errors={errors.fieldErrors.pais} />}
                </div>
                <div className="flex flex-col mb-4">
                    <label
                        htmlFor="cp"
                        className="text-stone-600 mb-1 text-sm">
                        Codigo postal
                    </label>
                    <input
                        onChange={(e) => setDireccion(p => { return { ...p, cp: e.target.value } })}
                        id="cp"
                        name="cp"
                        className="w-full text-stone-600 p-1.5 border shadow-sm rounded-3xl focus:outline-blue-300" />
                    {errors && errors.fieldErrors.cp && <ErrorAlert errors={errors.fieldErrors.cp} />}
                </div>
                <div className="flex justify-between self-end p-1 w-full">
                    <label className="text-stone-600 mb-1 text-sm">
                        Subtotal:
                    </label>
                    <p className="text-stone-600 mb-1 text-sm">
                        ${calcularSubTotal()}
                    </p>
                </div>
                <div className="flex justify-between self-end p-1 w-full">
                    <label htmlFor="costo" className="text-stone-600 mb-1 text-sm">
                        Costo de envío:
                    </label>
                    <p
                        id="costo"
                        className="text-stone-600 mb-1 text-sm">
                        ${costoDeEnvio}
                    </p>
                </div>
                <div className="h-[1px] w-full bg-gray-200"></div>
                <div className="flex justify-between self-end p-1 w-full">
                    <label className="text-stone-600 mb-1 text-sm font-semibold">
                        Total:
                    </label>
                    <p className="text-stone-600 mb-1 text-sm">
                        ${calcularSubTotal() + costoDeEnvio}
                    </p>
                </div>
                <div className={clsx("justify-between self-end p-1 w-full", {
                    "hidden": !tiempoDeEnvio,
                    "flex": tiempoDeEnvio
                })}>
                    <label className="text-stone-600 mb-1 text-sm font-semibold">
                        Tiempo aproximado de envío:
                    </label>
                    <p className="text-stone-600 mb-1 text-sm">
                        {tiempoDeEnvio} dias
                    </p>
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full border drop-shadow-sm text-stone-600 font-semibold bg-yellow-300 rounded-3xl py-2">
                    Comprar
                </button>
            </form>
        </div>
    )
}