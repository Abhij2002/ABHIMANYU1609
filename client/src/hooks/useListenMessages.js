import { useEffect, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { selectedConversation, setMessages } = useConversation();
	const selectedId = selectedConversation?._id?.toString();

	const handleNewMessage = useCallback(
		(newMessageRaw) => {
			if (!newMessageRaw) return;

			const isGroupMatch =
				newMessageRaw.groupId?.toString() === selectedId;

			const isPrivateMatch =
				newMessageRaw.senderId?.toString() === selectedId &&
				!newMessageRaw.groupId;

			if (isGroupMatch || isPrivateMatch) {
				const newMessage = {
					...newMessageRaw,
					shouldShake: true,
				};

				try {
					const audio = new Audio(notificationSound);
					audio.play().catch((err) => console.warn("Audio error:", err));
				} catch (err) {
					console.error("Audio error:", err);
				}

				// ✅ Ensure `prev` is always array
				setMessages((prev = []) => [...prev, newMessage]);
			}
		},
		[selectedId, setMessages]
	);

	useEffect(() => {
		if (!socket) return;

		socket.on("newMessage", handleNewMessage);
		socket.on("newGroupMessage", handleNewMessage);

		return () => {
			socket.off("newMessage", handleNewMessage);
			socket.off("newGroupMessage", handleNewMessage);
		};
	}, [socket, handleNewMessage]);
};

export default useListenMessages;
