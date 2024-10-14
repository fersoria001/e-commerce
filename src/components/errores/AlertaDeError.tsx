export function AlertaDeError({ errores, className }: { errores: string[], className?: string }) {
    return (
        <div className={className || "py-1"}>
            {
                errores.map((e, i) => {
                    return (
                        <p
                            key={i}
                            className="text-red-500 text-xs">
                            {e}
                        </p>
                    )
                })
            }
        </div>
    )
}