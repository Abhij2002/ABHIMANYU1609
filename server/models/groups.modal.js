import mongoose from "mongoose";
const groupSchema = new mongoose.Schema({
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groupMessages' }],
    isGroup: {type: Boolean,default:true},
});
const Group = mongoose.model("Group", groupSchema);

export default Group;