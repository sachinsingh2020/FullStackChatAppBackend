import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import ErrorMiddleware from './middlewares/Error.js';
import cookieParser from 'cookie-parser';



config({
    path: "./config/config.env",
});

const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

import user from './routes/userRoutes.js';
import chat from './routes/chatRoutes.js';
import message from './routes/messageRoutes.js';

app.use('/api/v1', user);
app.use('/api/v1', chat);
app.use('/api/v1', message);

app.get('/', (req, res) => {
    res.send('Working');
})

export default app;

app.use(ErrorMiddleware);
