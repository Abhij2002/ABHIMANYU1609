// routes/group.routes.js
import express from "express";
import { groups, handler } from "../controllers/group.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, handler);    
router.get("/", protectRoute, groups);       


export default router;
