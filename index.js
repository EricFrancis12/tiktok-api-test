require('dotenv').config();

const express = require('express');
const app = express();



const loginRouter = require('./routes/login/login');
app.use('/login', loginRouter);

const oauthRouter = require('./routes/oauth/oauth');
app.use('/oauth', oauthRouter);

const uploadRouter = require('./routes/upload/upload');
app.use('/upload', uploadRouter);



app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`));
