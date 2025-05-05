import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useEffect } from "react";


const MessageContainer = () => {
	const {selectedConversation,setSelectedConversation} = useConversation();
	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);
	
	return (
		<div className=' mt-[1rem] mb-[1rem] rounded-l-[2rem] w-[74rem] bg-gray-100  flex py-4 flex-col'>
		
		{!selectedConversation ? (
			<NoChatSelected />
		) : (
				<>
					
					<div className='border-b pb-5 pl-5 border-b-gray-400'>
						<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt=""  className="border object-cover rounded-full border-black border-2 transition z-20 size-[2.5rem] inline"/>
						<span className='text-emerald-800 font-bold ml-[1rem]'>{selectedConversation.fullName}</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
			</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	
	return (
		<div className='flex items-center justify-center w-full h-screen'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-400 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome to ChitChat</p>
			</div>
		</div>
	);
};