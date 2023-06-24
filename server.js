import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import { connectDB } from './config/database.js';
import { ioFunction } from './socket.js';
import cloudinary from 'cloudinary';


connectDB();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
})

const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 10000, // 10 seconds
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on('connection', ioFunction)

server.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`.magenta.bold);
})