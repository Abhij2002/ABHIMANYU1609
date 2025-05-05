import Conversation from "../models/conversation.modal.js";
import Group from "../models/groups.modal.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import groupConversation from "../models/groupConversation.model.js";
import groupMessages from "../models/groupMessages.model.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let group = await Group.findById(receiverId);
		let isGroup = !!group;

		let newMessage, conversation;

		if (isGroup) {
			conversation = await groupConversation.findOne({ _id: receiverId });

			if (!conversation) {
				conversation = await groupConversation.create({
					_id: receiverId,
					participants: group.members,
				});
			}

			newMessage = new groupMessages({
				senderId,
				groupId: receiverId,
				message,
			});
			conversation.messages.push(newMessage._id);

			await Promise.all([conversation.save(), newMessage.save()]);

			group.members.forEach((memberId) => {
				if (memberId.toString() !== senderId.toString()) {
					const socketIds = getReceiverSocketId(memberId);
						socketIds.forEach(socketId => {
							io.to(socketId).emit("newGroupMessage", newMessage);
						});

				}
			});
		} else {
			conversation = await Conversation.findOne({
				participants: { $all: [senderId, receiverId] },
			});

			if (!conversation) {
				conversation = await Conversation.create({
					participants: [senderId, receiverId],
				});
			}

			newMessage = new Message({
				senderId,
				receiverId,
				message,
			});
			conversation.messages.push(newMessage._id);

			await Promise.all([conversation.save(), newMessage.save()]);

			const socketId = getReceiverSocketId(receiverId);
			if (socketId) {
				io.to(socketId).emit("newMessage", newMessage);
			}
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id } = req.params;
		const senderId = req.user._id;

		const group = await Group.findById(id);
		const isGroup = !!group;

		let messages = [];

		if (isGroup) {
			const conversation = await groupConversation.findOne({ _id: id }).populate({
				path: "messages",
				populate: {
					path: "senderId",
					select: "name profilePic", // Optional: keep payload small
				},
			});
			
			
			if (!conversation) return res.status(200).json([]);
			messages = conversation.messages;
		} else {
			const conversation = await Conversation.findOne({
				participants: { $all: [senderId, id] },
			}).populate("messages");

			if (!conversation) return res.status(200).json([]);
			messages = conversation.messages;
		}

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
