import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useUsersStore } from "../../zustand/userStore"; // ✅ import

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();
	const setUsers = useUsersStore((state) => state.setUsers); // ✅ grab setter

	const isSelected = selectedConversation?._id === conversation._id;
	const isOnline = onlineUsers.includes(conversation._id);
	const isGroup = conversation.isGroup;

	const name = isGroup ? conversation.name : conversation.fullName;
	const profilePic = isGroup
		? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
		: conversation.profilePic;


	
	const handleSelect = () => {
		setSelectedConversation(conversation);
		setUsers(conversation.isGroup ? conversation.members || [] : []);
	};
	

	return (
		<>
			<div
				className={`group flex gap-2 items-center hover:bg-emerald-800 p-2 py-1 cursor-pointer mb-[-0.1rem] bg-white-800
					${isSelected ? "bg-emerald-800" : ""}`}
				onClick={handleSelect} // ✅ here
			>
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className="w-11 rounded-full">
						<img src={profilePic} alt="avatar" />
					</div>
				</div>
				<div className="flex flex-col flex-1">
					<div className="flex gap-3 justify-between">
						<p
							className={`font-bold group-hover:text-white ${
								isSelected ? "text-white" : "text-emerald-800"
							}`}
						>
							{name}
						</p>
						<span className="text-xl">{emoji}</span>
					</div>
				</div>
			</div>
			{!lastIdx && <div className="divider my-0 py-0 h-1" />}
		</>
	);
};

export default Conversation;
