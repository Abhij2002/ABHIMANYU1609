import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = ({groups}) => {
	const { loading, conversations } = useGetConversations();

	const transformedGroups = groups.map(group => ({
		...group,
		fullName: group.name,
	}));

	const allConversations = [...conversations, ...transformedGroups];
	return (
		<div className='flex flex-col h-screen overflow-auto mt-[3rem] ml-[3rem] mr-[3rem] bg-gray-100 rounded-t-[1.5rem] mb-[-1rem]'>
			{allConversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === allConversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};

export default Conversations;
