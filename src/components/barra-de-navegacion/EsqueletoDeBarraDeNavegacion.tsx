import { Skeleton } from "@/components/ui/skeleton"

export default function EsqueletoDeBarraDeNavegacion() {
  return (
    <nav className="z-30 top-0 bg-red-500 w-full flex justify-between md:px-3">
      <div className="flex items-center xl:px-4">
        <Skeleton className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] lg:w-[64px] lg:h-[64px] rounded-full" />
        <Skeleton className="h-6 w-24 ml-2" />
      </div>
      <div className="flex text-black text-md w-full justify-between md:ps-10">
        <Skeleton className="h-11 w-24 rounded-md px-8 self-center" />
        <div className="flex md:space-x-2 items-center">
          <Skeleton className="h-11 w-24 rounded-md px-8 self-center" />
        </div>
      </div>
    </nav>
  )
}