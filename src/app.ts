import dotenv from 'dotenv';
import express from 'express';
import errorHandler from './exceptions/errorHandler';
import authrouter from './router/auth.router';
import cookieparser from 'cookie-parser'


dotenv.config({
    path : '../.env'
});

const app  = express();
app.use(cookieparser());
app.use(express.json());
app.use(authrouter)

app.use(errorHandler.unexceptionError)
app.use(errorHandler.error404)

app.listen(process.env.PORT , ()=> {
    console.log(`project run on port ${process.env.PORT}`);
})