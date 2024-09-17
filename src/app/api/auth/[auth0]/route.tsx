// app/api/auth/[auth0]/route.js
import { handleAuth, handleLogin, LoginHandlerError, LoginOptions } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers';
export const GET = handleAuth({
    async login(req: NextApiRequest, res: NextApiResponse) {
        try {
            return await handleLogin(req, res, { returnTo: headers().get('referer') } as LoginOptions);
        } catch (err: unknown) {
            if (err instanceof LoginHandlerError)
                res.status(err.status ?? 500).end(err.message)
        }
    }
});