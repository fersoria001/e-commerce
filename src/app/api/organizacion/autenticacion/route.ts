import { kv } from '@vercel/kv';
export async function GET() {
    const respuesta = await fetch(`https://${process.env.AUTH0_M2M_DOMAIN}/oauth/token`,
        {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: `${process.env.AUTH0_M2M_CLIENT_ID}`,
                client_secret: `${process.env.AUTH0_M2M_CLIENT_SECRET}`,
                audience: `https://${process.env.AUTH0_M2M_DOMAIN}/api/v2/`
            }),
            cache: 'no-store'
        }
    )
    const datos = await respuesta.json()
    if (datos.error) {
        return new Response(null, { status: 401, statusText: datos.error })
    }
    //await kv.keys("*")
    await kv.set('auth0-m2m-token', datos.access_token, { ex: 8200 });
    return new Response(null, { status: 200 })
}