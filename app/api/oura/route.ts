import axios from 'axios';
import * as qs from 'querystring';
import { NextRequest, NextResponse } from 'next/server'; // Import NextResponse as a value

export async function POST(req: NextRequest): Promise<NextResponse> {
    const code = req.nextUrl.searchParams.get('code'); // Correctly accessing the 'code' parameter

    if (!code) {
        return new NextResponse(JSON.stringify({ error: 'Authorization code is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
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

        return new NextResponse(JSON.stringify({ access_token, refresh_token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to exchange authorization code for tokens' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
