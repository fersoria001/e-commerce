export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Pagina() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-xl border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Aviso Legal</CardTitle>
          <CardDescription className="text-gray-600">PCTech - Tu tienda online de tecnología</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-500 text-right">
            10 de Octubre de 2024 - Ciudad de Buenos Aires, Argentina
          </div>
          
          <p className="text-lg">
            Bienvenido a PCTech, tu destino confiable para todas tus necesidades tecnológicas.
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-2">Propiedad del Sitio Web</h2>
            <p className="">
              Este sitio web es propiedad y está operado por PCTech. Todos los derechos, títulos e intereses relacionados con el contenido proporcionado en este sitio web, incluidos, entre otros, los textos, gráficos, imágenes, logotipos y software, son propiedad de PCTech o de sus respectivos propietarios.
            </p>
          </section>

          <Separator className="my-4" />

          <section>
            <h2 className="text-xl font-semibold mb-2">Uso del Sitio Web</h2>
            <p className="">
              Al acceder a este sitio web, aceptas cumplir con los términos y condiciones establecidos en este aviso legal. Te comprometes a utilizar este sitio web de manera ética y legal, respetando los derechos de propiedad intelectual y las leyes aplicables.
            </p>
          </section>

          <Separator className="my-4" />

          <section>
            <h2 className="text-xl font-semibold mb-2">Enlaces a Terceros</h2>
            <p className="">
              Este sitio web puede contener enlaces a otros sitios web que no son operados por PCTech. No tenemos control sobre el contenido y las políticas de privacidad de estos sitios y no aceptamos ninguna responsabilidad por ellos. Te recomendamos revisar las políticas de privacidad y términos de uso de cualquier sitio web de terceros al que accedas a través de nuestros enlaces.
            </p>
          </section>

          <Separator className="my-4" />

          <section>
            <h2 className="text-xl font-semibold mb-2">Limitación de Responsabilidad</h2>
            <p className="">
              PCTech no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de uso de este sitio web o de su contenido, incluso si se ha advertido de la posibilidad de tales daños. Nos esforzamos por proporcionar información precisa y actualizada, pero no garantizamos la exactitud, integridad o idoneidad de la información para ningún propósito particular.
            </p>
          </section>

          <Separator className="my-4" />

          <section>
            <h2 className="text-xl font-semibold mb-2">Modificaciones del Aviso Legal</h2>
            <p className="">
              PCTech se reserva el derecho de modificar este aviso legal en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en el sitio web. Es tu responsabilidad revisar periódicamente este aviso legal para estar al tanto de cualquier cambio. El uso continuado de nuestro sitio web después de la publicación de cambios constituirá tu aceptación de dichos cambios.
            </p>
          </section>

          <Separator className="my-4" />

          <section>
            <h2 className="text-xl font-semibold mb-2">Contacto</h2>
            <p className="">
              Si tienes alguna pregunta sobre este aviso legal o necesitas más información, no dudes en contactarnos a:
            </p>
            <a href="mailto:bercho001@gmail.com" className="text-red-500 hover:text-red-600 transition-colors duration-200">
              bercho001@gmail.com
            </a>
          </section>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 PCTech. Todos los derechos reservados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}