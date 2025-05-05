import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { selectedConversation, setMessages } = useConversation();

	useEffect(() => {
		const handleNewMessage = (newMessage) => {
			const selectedId = selectedConversation?._id?.toString();

			// If it's a group message
			if (newMessage.groupId && newMessage.groupId.toString() === selectedId) {
				newMessage.shouldShake = true;
				new Audio(notificationSound).play();
				setMessages(prev => [...prev, newMessage]);
			}

			// If it's a private message
			if (
				newMessage.senderId &&
				newMessage.senderId.toString() === selectedId &&
				!newMessage.groupId
			) {
				newMessage.shouldShake = true;
				new Audio(notificationSound).play();
				setMessages(prev => [...prev, newMessage]);
			}
		};

		socket?.on("newMessage", handleNewMessage);
		socket?.on("newGroupMessage", handleNewMessage);

		return () => {
			socket?.off("newMessage", handleNewMessage);
			socket?.off("newGroupMessage", handleNewMessage);
		};
	}, [socket, selectedConversation, setMessages]);
};

export default useListenMessages;
