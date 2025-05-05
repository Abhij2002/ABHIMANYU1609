import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId] ? Array.from(userSocketMap[receiverId]) : [];
};


const userSocketMap = {}; // { userId: Set<socketId> }

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId && userId !== "undefined") {
		if (!userSocketMap[userId]) {
			userSocketMap[userId] = new Set();
		}
		userSocketMap[userId].add(socket.id);
	}

	// Emit current online users
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);

		// Remove socket ID from user's set
		if (userSocketMap[userId]) {
			userSocketMap[userId].delete(socket.id);
			if (userSocketMap[userId].size === 0) {
				delete userSocketMap[userId];
			}
		}

		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});


export { app, io, server };