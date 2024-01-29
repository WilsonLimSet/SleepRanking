import axios from 'axios';
import * as qs from 'querystring';
import { NextRequest, NextResponse } from 'next/server'; // Import NextResponse as a value
import { createClient } from "@/utils/supabase/client";


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
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET, // Use environment variable
                redirect_uri: 'https://www.sleepranking.com/api/oura'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token } = response.data;

        // Store access_token and refresh_token in your database
      
        const user = session?.user;
        const supabase = createClient();
        

        const { data, error } = await supabase
        .from('profiles')
        .update({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token
        })
        .eq("id", user?.id ?? "")

        return new NextResponse(JSON.stringify({ access_token, refresh_token }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error((error as any).response.data); // Log the entire response from the Oura API
        console.error(error); // Log the entire error object                                                                                                          
        return new NextResponse(JSON.stringify({ error: 'Failed to exchange authorization code for tokens' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    }
    

