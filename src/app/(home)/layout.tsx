export default function Layout({
    children,
    productos
}: {
    children: React.ReactNode
    productos: React.ReactNode

}) {
    return (
        <>
            {children}
            {productos}
        </>
    )
}