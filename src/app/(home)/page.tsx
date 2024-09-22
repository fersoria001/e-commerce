import ProductCarousel from "@/components/carousel/ProductCarousel";
import { MainBanner } from "@/components/home/MainBanner";
import { Product } from "@/types/types";
import { promises as fs } from 'fs';

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/src/app/products.json', 'utf8');
  const products = JSON.parse(file) as Product[]

  return (
    <div>
      <MainBanner />
      <section>
        <ProductCarousel products={products} />
      </section>
    </div>
  );
}
