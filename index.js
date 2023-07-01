require('dotenv').config();

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





app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`));