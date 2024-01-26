require('dotenv').config();
const axios = require('axios');
const qs = require('querystring');

module.exports = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        const response = await axios.post('https://api.ouraring.com/oauth/token', 
            qs.stringify({
                grant_type: 'authorization_code',
                code,
                client_secret: process.env.ClientSecret, // Use environment variable
                redirect_uri: 'https://www.sleepranking.com/'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token } = response.data;

        // TODO: Store access_token and refresh_token in your Supabase database

        res.status(200).json({ access_token, refresh_token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to exchange authorization code for tokens' });
    }
};
