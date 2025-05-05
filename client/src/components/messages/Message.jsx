import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();

	const isGroup = selectedConversation?.isGroup;
	const fromMe = message.senderId._id === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const shakeClass = message.shouldShake ? "shake" : "";

	const sender = isGroup ? message.senderId : null;

	return (
		<div className={`chat ${chatClassName}`}>
			{isGroup && sender && (
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img src={sender.profilePic} alt={sender.name} />
					</div>
				</div>
			)}

			<div className={`chat-bubble font-bold bg-white text-emerald-800 ${shakeClass}`}>
				{isGroup && sender && (
					<div className="text-xs font-semibold text-gray-500 mb-1 bg-black ">
						{sender.name}
					</div>
				)}
				{message.message}
			</div>

			<div className="chat-footer opacity-70 text-xs flex items-center">
				<b>{formattedTime}</b>
			</div>
		</div>
	);
};
export default Message;
