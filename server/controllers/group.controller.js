import Group from "../models/groups.modal.js";
// POST /api/groups
export async function handler(req, res) {
    const { name, members } = req.body;
    const userId = req.user._id; // from session/cookie

    const group = await Group.create({
        name,
        members,
        admin: userId,
        messages: [],
        isGroup:true,
    });

    res.status(201).json(group);
}

export async function groups(req,res){
    try {
        const userId = req.user._id; 
        const userGroups = await Group.find({ members: userId });
    
        return res.status(200).json(userGroups);
      } catch (error) {
        console.error('Error fetching user groups:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
}