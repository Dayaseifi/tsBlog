import dotenv from 'dotenv';
import express from 'express';
import errorHandler from './exceptions/errorHandler';
import authrouter from './router/auth.router';
import cookieparser from 'cookie-parser'
import Blogrouter from './router/blog.router';
import { landingPage } from './controller/landing.controller';
import Commentrouter from './router/comment.router';


dotenv.config({
    path: '../.env'
});

const app = express();
app.use(cookieparser());
app.use(express.json());
app.use(authrouter)
app.use('/blog', Blogrouter)
app.use('/comment' , Commentrouter)
app.use('/', landingPage)


app.use(errorHandler.unexceptionError)
app.use(errorHandler.error404)

app.listen(process.env.PORT, () => {
    console.log(`project run on port ${process.env.PORT}`);
})