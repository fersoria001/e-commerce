import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full p-3 left dark:text-white">
            <ul className="text-center  border border-red-500 p-2">
                <li>
                    <Link href={"/acerca_de_nosotros"}>
                        Acerca de nosotros
                    </Link>
                </li>
                <li>
                    <Link href={"/legal"}>
                        Legal
                    </Link>
                </li>
                <li>
                    <Link href={"/politicas_de_privacidad"}>
                        Politicas de privacidad
                    </Link>
                </li>
                <li>
                    <Link href={"/en_donde_encontrarnos"}>
                        En donde encontrarnos
                    </Link>
                </li>
            </ul>
            <h3 className="text-center  font-extrabold">PcTech</h3>
            <p className="text-center ">
                Av. Nombre 1234, Ciudad, Provincia, Argentina
            </p>
            <ul className=" flex justify-around">
                <li>+54 011 998877</li>
                <li>pc-tech@gmail.com</li>
            </ul>
        </footer>
    )
}