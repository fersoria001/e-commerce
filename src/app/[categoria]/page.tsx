import { promises as fs } from 'fs';
import { Product } from '@/types/types';
import { Grid } from '@/components/grid/Grid';
export default async function Page({ params }: { params: { categoria: string } }) {
    const file = await fs.readFile(process.cwd() + '/src/app/products.json', 'utf8');
    const allProducts = JSON.parse(file) as Product[]
    const products = allProducts.filter((p) => p.categoria.toLowerCase() == decodeURIComponent(params.categoria).toLocaleLowerCase())
    return (
        <div className="min-h-screen mt-24 xl:mt-48">
            <Grid products={products} />
        </div>
    )
}