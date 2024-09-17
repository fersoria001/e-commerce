import { Carousel } from "@/components/carousel/Carousel";
import { Grid } from "@/components/grid/Grid";
import { Product } from "@/types/types";
import { promises as fs } from 'fs';
import Image from "next/image";



export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/src/app/products.json', 'utf8');
  const products = JSON.parse(file) as Product[]
  return (
    <div>
      <section id="main-banner">
        <div className="left">
          <div className="absolute z-10 bottom-10 left-4 flex">
            <Image
              src={"/headphones1.png"}
              alt="headphones image"
              width={124}
              height={124}
            />
          </div>
          <div className="absolute top-1/4 mt-20 w-full z-10">
            <h2
              className="md:text-start md:ps-12 text-center text-4xl text-white drop-shadow-md">
              Mejores precios
            </h2>
          </div>
          <div className="right h-[100vh]">
            <div className="absolute z-10 right-4 top-24 xl:top-1/4">
              <Image
                src={"/gpuamd1.png"}
                alt="gpu amd image"
                width={124}
                height={124}
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <Carousel products={products} />
      </section>
      <section>
        <h3 className="text-center text-black bg-yellow-300">
          Hasta 40% off
        </h3>
        <Grid products={products} />
      </section>
    </div>
  );
}
