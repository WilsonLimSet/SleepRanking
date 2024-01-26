import axios from 'axios';
import * as qs from 'querystring';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const { code } = req.query;

    if (typeof code !== 'string' || !code) {
        res.status(400).json({ error: 'Authorization code is required' });
        return;
    }

    try {
        const response = await axios.post('https://api.ouraring.com/oauth/token', 
            qs.stringify({
                grant_type: 'authorization_code',
                code,
                client_secret: process.env.CLIENT_SECRET, // Use environment variable
                redirect_uri: 'https://www.sleepranking.com/'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token } = response.data;

        // Store access_token and refresh_token in your database

        res.status(200).json({ access_token, refresh_token });
        console.log(access_token, refresh_token );
    } catch (error) {
        res.status(500).json({ error: 'Failed to exchange authorization code for tokens' });
    }
}
