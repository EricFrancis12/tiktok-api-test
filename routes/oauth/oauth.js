const queryString = require('querystring');

const express = require('express');
const router = express.Router();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));



router.get('/', async (req, res) => {
    try {
        const endpoint = 'https://open.tiktokapis.com/v2/oauth/token/';
        let code = req.query.code;
        if (!code) code = process.env.CODE_FINANCIAL_FLARE;

        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            method: 'POST',
            body: queryString.stringify({
                client_key: process.env.TIKTOK_API_CLIENT_KEY,
                client_secret: process.env.TIKTOK_API_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: 'https://tiktok-api-test.onrender.com/login/callback/'
            })
        });
        const resJSON = await response.json();
        console.log(resJSON);

        res.status(200).json({
            success: true,
            message: resJSON
        });
    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});



module.exports = router;
