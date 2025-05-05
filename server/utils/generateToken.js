import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
};
// middleware/authMiddleware.js
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) return res.status(401).json({ error: "Not authorized" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.userId).select("-password");
		next();
	} catch (err) {
		console.error("Auth middleware error:", err.message);
		res.status(401).json({ error: "Token verification failed" });
	}
};



export default generateTokenAndSetCookie;