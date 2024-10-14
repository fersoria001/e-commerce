import { Skeleton } from "@/components/ui/skeleton"

export default function FormularioDeConfiguracionDeUsuarioSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
    )
}