import { useEffect, useState } from "react";

type DimensionDeVentana = {
    ancho: number;
    alto: number;
}
export function useDimensionesDeVentana() {
    const [dimensionDeVentana, setDimensionDeVentana] = useState<DimensionDeVentana>({ ancho: 0, alto: 0 })
    useEffect(() => setDimensionDeVentana(
        {
            ancho: window.innerWidth,
            alto: window.innerHeight
        }
    ), [])
    return dimensionDeVentana
}