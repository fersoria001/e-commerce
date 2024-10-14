'use client'
import { Skeleton } from "../ui/skeleton"
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api"
export function MapaDeGoogle() {
    const estiloDeContenedorDeMapa = {
        width: "100%",
        height: "400px"
    }

    const centro = {
        lat: -34.6037,
        lng: -58.3816
    }
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
    })
    if (loadError) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <p className="text-red-500">Error al cargar el mapa</p>
            </div>
        )
    }
    if (!isLoaded) {
        return (
            <Skeleton className="w-full h-full" />
        )
    }
    return (
        <GoogleMap
            mapContainerStyle={estiloDeContenedorDeMapa}
            zoom={13}
            center={centro}
        >
            <MarkerF position={centro} />
        </GoogleMap>
    )
}