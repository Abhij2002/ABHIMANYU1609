import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		<div
			className='px-4 flex-1 overflow-auto 
				[&::-webkit-scrollbar]:w-2
				[&::-webkit-scrollbar-track]:bg-gray-100
				[&::-webkit-scrollbar-thumb]:bg-emerald-800
				bg-[url(../../../../../public/5.jpg)]'
		>
			{!loading && Array.isArray(messages) && messages.length > 0 &&
				messages.map((message, index) => (
					<div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
						<Message message={message} />
					</div>
				))
			}

			
			{!loading && (!Array.isArray(messages) || messages.length === 0) && (
				<p className="text-center text-gray-500 py-4">No messages yet.</p>
			)}

			
			{loading &&
				[...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
			}
		</div>
	);
};

export default Messages;
