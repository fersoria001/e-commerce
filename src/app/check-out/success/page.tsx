// /src/app/checkout/success/page.tsx

import { lineItems } from "@/actions"
import { Receipt } from "@/components/checkout/Receipt"
import { redirect } from "next/navigation"


const SuccessPage = async ({ searchParams }: { searchParams?: { id: string } }) => {
    if (!searchParams?.id) {
        return redirect("/")
    }
    const receipt = await lineItems(searchParams.id)
    return (
        <div className="p-2 md:p-8">
            <Receipt receipt={receipt} />
        </div>
    )
}

export default SuccessPage