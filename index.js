require('dotenv').config();

const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());



app.get('/', (req, res) => {
    res.status(200).send('/Root');
});



const loginRouter = require('./routes/login/login');
app.use('/login', loginRouter);

const oauthRouter = require('./routes/oauth/oauth');
app.use('/oauth', oauthRouter);

const uploadRouter = require('./routes/upload/upload');
app.use('/upload', uploadRouter);



const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
