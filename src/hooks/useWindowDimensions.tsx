import { useEffect, useState } from "react";

type WindowSize = {
    width: number;
    height: number;
}
export function useWindowDimensions() {
    const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 })
    useEffect(() => setWindowSize(
        {
            width: window.innerWidth,
            height: window.innerHeight
        }
    ),[])
    return windowSize
}