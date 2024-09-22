import { promises as fs } from 'fs';
import { Product } from '@/types/types';
import { Producto } from '@/components/producto/Producto';
import { Sugerencias } from '@/components/sugerencias/Sugerencias';
async function Page({ searchParams }: { searchParams?: { id?: string } }) {
    const id = searchParams?.id || undefined;
    if (!id) {
        throw new Error("no se puede encontrar el producto porque el id es invalido o esta vacío")
    }
    const file = await fs.readFile(process.cwd() + '/src/app/products.json', 'utf8');
    const products = JSON.parse(file) as Product[]
    const product = products.find((p) => p.id == id)
    if (!product) {
        throw new Error(`no se puede encontrar el producto con id ${id} en productos`)
    }
    return (
        <div className="min-h-screen mt-16 px-2">
            <Producto item={product} />
            <Sugerencias products={products} />
        </div>
    )
}

export default Page;