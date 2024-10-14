import { Skeleton } from "@/components/ui/skeleton"

export default function EsqueletoDeRecibo() {
    return (
        <div className="flex flex-col rounded-3xl w-full max-w-sm mx-auto lg:max-w-lg border border-stone-350 h-screen">
            <div className="flex flex-col items-center py-6 px-4 lg:px-[4.5rem]">
                <div className="flex lg:flex-col-reverse">
                    <Skeleton className="w-[40px] h-[40px] mt-2 mr-4 lg:w-[250px] lg:h-[250px] rounded-3xl" />
                    <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-8 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </div>
            <div className="flex justify-center mb-6">
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
        </div>
    )
}