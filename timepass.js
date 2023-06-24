import http from 'http';
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

config({
    path: "./config/config.env",
});
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", () => {
    console.log("socket connected")
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get('/', (req, res) => {
    res.send('<h1> Chat App Server Is Working</h1>');
})

app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})
