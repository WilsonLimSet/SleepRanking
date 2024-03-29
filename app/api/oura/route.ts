import axios from 'axios';
import * as qs from 'querystring';
import { createClient } from "@/utils/supabase/client"; // Make sure this path is correct
import { NextRequest, NextResponse } from 'next/server'; // Import NextResponse as a value
import { getUserData } from '@/app/components/userData';

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
        const user = await getUserData();  // Get the user data\
        const supabase = createClient();


      
        if (!user) {
            console.error('User is null');
            return new NextResponse(JSON.stringify({ error: 'User is null' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { error } = await supabase.from("profiles").insert({
            access_token: access_token,
            refresh_token: refresh_token,
        }).eq("user_id", user.id);
        if (error) {
            console.error('Supabase insert error:', error);
        }

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
    
