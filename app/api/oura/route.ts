import axios from 'axios';
import * as qs from 'querystring';
import { createClient } from "@/utils/supabase/client"; // Make sure this path is correct
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
        const supabase = createClient(); // Initialize Supabase client
        const {data: { user },} = await supabase.auth.getUser();
        const userId = user?.id;

        console.log(response.data);
        console.log(access_token);
        console.log(refresh_token);
        const { error } = await supabase.from("profiles").insert({
            access_token: access_token,
            refresh_token: refresh_token,
        }).eq("user_id", userId);
        if (error) {
            console.error('Supabase insert error:', error);
            // Handle the error appropriately
        }


        // Store access_token and refresh_token in your database

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
    
