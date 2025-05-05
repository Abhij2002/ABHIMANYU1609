import mongoose from 'mongoose';

const groupMessagesSchema =new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        message: {
			type: String,
			required: true,
		},
    },
    {timestamps: true}
);
const groupMessages = mongoose.model("groupMessages",groupMessagesSchema);
export default groupMessages;