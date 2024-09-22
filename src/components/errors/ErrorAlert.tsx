export function ErrorAlert({ errors }: { errors: string[] }) {
    return (
        <div className="py-1">
            {
                errors.map((e, i) => {
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