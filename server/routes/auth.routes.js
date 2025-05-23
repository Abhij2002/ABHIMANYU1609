import  express  from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { getMe } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { protect } from '../utils/generateToken.js';
import { updateProfilePic,upload } from '../controllers/auth.controller.js';

const router = express.Router();
router.get("/me", protectRoute, getMe);

router.post('/signup', signup);
router.put("/update-profile-pic", protect, upload.single("profilePic"), updateProfilePic);
router.post('/login',login )

router.get('/logout',logout )

export default router;
