import mongoose from "mongoose";

const groupConversationSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "groupMessages",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

const groupConversation = mongoose.model("groupConversation", groupConversationSchema);

export default groupConversation;