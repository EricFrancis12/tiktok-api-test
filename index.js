require('dotenv').config();

const axios = require('axios');

const express = require('express');
const app = express();





app.get('/login', (req, res) => {
    // IMPORTANT, it is your responsibility to store a csrf token
    // in your database, to be able to prevent xss attacks, read more
    // here (section 2.1) =>  https://developers.tiktok.com/doc/login-kit-web
    const createCsrfState = () => Math.random().toString(36).substring(7);
    const csrfState = createCsrfState();
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    // OLD URL: 
    // let url = 'https://open-api.tiktok.com/platform/oauth/connect/';

    let url = 'https://www.tiktok.com/v2/auth/authorize/';

    url += `?client_key=${process.env.TIKTOK_API_CLIENT_KEY}`;
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += `&redirect_uri=${encodeURIComponent(process.env.TIKTOK_CALLBACK_URI)}`;
    url += '&state=' + csrfState;

    // redirect the user to the generated URL
    // user will be prompted to login with tiktok
    // and authorize needed permissions

    console.log(url);
    res.redirect(url);
});



app.get('/login/callback', (req, res) => {
    console.log(req);
    console.log(req.query);
    console.log('GET callback received');

    res.status(200).json({
        access_token: req.query.code,
        token_type: 'Bearer'
    });
});

app.post('/login/callback', (req, res) => {
    console.log(req);
    console.log(req.body);
    console.log('POST callback received');
});





app.get('/upload/drafts', async (req, res) => {
    const access_token = req.query.access_token;
    console.log(access_token);
    const video_url = 'https://vcube.live/video-1.mp4';

    try {
        const endpoint = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/?access_token=' + access_token;

        const headers = {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }

        const requestBody = {
            source_info: {
                source: 'PULL_FROM_URL',
                video_url
            }
        };

        const response = await axios.post(endpoint, requestBody, { headers });
        console.log('Video added to drafts:', response.data);
    } catch (error) {
        console.error('Error adding video to drafts:', error.response.data);
        return res.status(500).json({
            success: false,
            message: error.response.data
        });
    }

    res.status(200).json({
        success: true,
        message: response.data
    })
});





app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`));