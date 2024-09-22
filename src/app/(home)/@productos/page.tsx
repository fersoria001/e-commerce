import { Grid } from "@/components/grid/Grid";
import { Product } from "@/types/types";
import { promises as fs } from 'fs';

export default async function Page({ searchParams }: { searchParams?: { page: string } }) {
    const file = await fs.readFile(process.cwd() + '/src/app/products.json', 'utf8');
    const products = JSON.parse(file) as Product[]
    const limit = 9
    const page = parseInt(searchParams?.page || "1", 10)
    const pages = Math.round(products.length / limit)
    const offset = (page - 1) * limit
    function paginateProducts() {
        if (offset + limit > products.length) {
            return products.slice(offset, products.length)
        }
        return products.slice(offset, offset + limit)
    }
    return (
        <section>
            <h3 className="text-center text-black bg-yellow-300">
                Hasta 40% off
            </h3>
            <Grid products={paginateProducts()} pages={pages} page={page} />
        </section>
    )
}