export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Pagina() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Política de Privacidad</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Introducción</AccordionTrigger>
              <AccordionContent>
                <p>
                  En PCTech, valoramos y respetamos su privacidad. Esta Política de Privacidad explica cómo recopilamos, 
                  usamos, divulgamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Información que Recopilamos</AccordionTrigger>
              <AccordionContent>
                <p>Podemos recopilar los siguientes tipos de información:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Información de contacto (nombre, dirección de correo electrónico, número de teléfono)</li>
                  <li>Información de la cuenta (nombre de usuario, contraseña)</li>
                  <li>Información de transacciones (historial de compras, detalles de pago)</li>
                  <li>Información técnica (dirección IP, tipo de dispositivo, tipo de navegador)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Uso de la Información</AccordionTrigger>
              <AccordionContent>
                <p>Utilizamos su información personal para:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Procesar sus pedidos y transacciones</li>
                  <li>Proporcionar soporte al cliente</li>
                  <li>Mejorar nuestros productos y servicios</li>
                  <li>Enviar comunicaciones de marketing (con su consentimiento)</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Compartir Información</AccordionTrigger>
              <AccordionContent>
                <p>
                  No vendemos su información personal. Podemos compartir su información con terceros de confianza 
                  que nos ayudan a operar nuestro negocio, como proveedores de servicios de pago y empresas de logística.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Seguridad de Datos</AccordionTrigger>
              <AccordionContent>
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal 
                  contra acceso no autorizado, pérdida o alteración.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Sus Derechos</AccordionTrigger>
              <AccordionContent>
                <p>Usted tiene derecho a:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Acceder a su información personal</li>
                  <li>Corregir información inexacta</li>
                  <li>Solicitar la eliminación de sus datos</li>
                  <li>Oponerse al procesamiento de sus datos</li>
                  <li>Retirar su consentimiento en cualquier momento</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Política de Cookies</AccordionTrigger>
              <AccordionContent>
                <p>
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web. 
                  Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio.
                </p>
                <p className="mt-2">Tipos de cookies que utilizamos:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Cookies esenciales: necesarias para el funcionamiento del sitio</li>
                  <li>Cookies de rendimiento: nos ayudan a mejorar el rendimiento del sitio</li>
                  <li>Cookies de funcionalidad: mejoran la experiencia del usuario</li>
                  <li>Cookies de publicidad: nos permiten mostrar anuncios relevantes</li>
                </ul>
                <p className="mt-2">
                  Puede gestionar sus preferencias de cookies a través de la configuración de su navegador. 
                  Tenga en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Cambios en la Política de Privacidad</AccordionTrigger>
              <AccordionContent>
                <p>
                  Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio 
                  significativo publicando la nueva Política de Privacidad en esta página y actualizando la fecha de &quot;última actualización&quot;.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>Contacto</AccordionTrigger>
              <AccordionContent>
                <p>
                  Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos en:
                </p>
                <p className="mt-2">
                  <a href="mailto:bercho001@gmail.com" className="text-red-500 hover:text-red-600 transition-colors duration-200">
                    bercho001@gmail.com
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            Última actualización: 10 de Octubre de 2024
          </p>
        </CardContent>
      </Card>
    </div>
  )
}