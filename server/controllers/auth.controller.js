import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import multer from "multer";
import path from "path";
import  fs  from "fs";

const uploadPath = path.join(process.cwd(), "../client/uploads/");

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath, { recursive: true });
}
// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(process.cwd(), "../client/uploads/"));
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

export const upload = multer({ storage });


export const signup = async (req, res) => {
	try {
			const { fullName, username, password, confirmPassword, gender } = req.body;

			if (password !== confirmPassword) {
				return res.status(400).json({ error: "Passwords don't match" });
			}

			const existingUser = await User.findOne({ username });

			if (existingUser) {
				return res.status(400).json({ error: "Username already exists" });
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);


			const newUser = new User({
				fullName,
				username,
				password: hashedPassword,
				gender,
				isGroup:false,
			});

			await newUser.save();

			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateProfilePic = async (req, res) => {
	try {
		const userId = req.user._id;

		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const filePath = `uploads/${req.file.filename}`; 

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ profilePic: filePath },
			{ new: true }
		);

		res.status(200).json({
			message: "Profile picture updated",
			profilePic: updatedUser.profilePic,
		});
	} catch (error) {
		console.log("Error in updateProfilePic controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
