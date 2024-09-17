export function Footer() {
    return (
        <footer className="w-full p-3 left">
            <ul className="text-center text-white border border-yellow-200 p-2">
                <li>Acerca de nosotros</li>
                <li>Legal</li>
                <li>Donde encontrarnos</li>
            </ul>
            <h3 className="text-center text-white font-extrabold">PcTech</h3>
            <p className="text-center text-white">
                Av. Nombre 1234, Ciudad, Provincia, Argentina
            </p>
            <ul className="text-white flex justify-around">
                <li>+54 011 998877</li>
                <li>pc-tech@gmail.com</li>
            </ul>
        </footer>
    )
}