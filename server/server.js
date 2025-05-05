
// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server  } from './socket/socket.js';
import groupRoutes from './routes/group.routes.js';

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();
app.use(express.json()); // to parse the incoming request with JSON payloads from req.body
app.use(cookieParser()); 

const uploadsDir = path.join(process.cwd(), "../uploads");
app.use("/uploads", express.static(uploadsDir));
app.use("/api/auth",authRoutes)
app.use('/api/messages',messageRoutes);
app.use('/api/users',userRoutes);
app.use('/api/groups',groupRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(__dirname, '/client/dist')));


app.get('*', (req, res) => {res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
});

server.listen(PORT, () => {
  connectToMongoDB()
  console.log(`Server is running on ports ${PORT}`);
}); 