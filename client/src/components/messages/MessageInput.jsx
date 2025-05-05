import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		await sendMessage(message);
		setMessage("");
		setShowEmojiPicker(false);
	};

	const addEmoji = (emoji) => {
		setMessage((prev) => prev + emoji.native);
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='pl-[1rem] w-[71rem] h-[3rem] ml-[-0.5rem] rounded-[1rem]'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>

				<div className='absolute right-12 top-1/2 transform -translate-y-1/2'>
					<button
						type='button'
						onClick={() => setShowEmojiPicker((prev) => !prev)}
						className='text-xl'
					>
						<FaRegSmile />
					</button>
					{showEmojiPicker && (
						<div className='absolute bottom-12 right-0 z-10'>
							<Picker data={data} onEmojiSelect={addEmoji} />
						</div>
					)}
				</div>

				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
					{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
