import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar/NavBar";
import { Footer } from "@/components/footer/Footer";
import { promises as fs } from 'fs';
import Providers from "./providers";
import { getSession } from "@auth0/nextjs-auth0";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export type Categoria = {
  id: string;
  categoria: string;
  subCategorias: string[];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const file = await fs.readFile(process.cwd() + '/src/app/categorias.json', 'utf8');
  const categorias = JSON.parse(file) as Categoria[]
  const session = await getSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >   <Providers user={session?.user}>
          <Navbar categorias={categorias} />
          {children}
          <Footer />
        </Providers>
      </body>

    </html>
  );
}
