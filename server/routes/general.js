import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";
import { isAuthenticated } from "../middlewares/index.js";
const router = express.Router();

router.get("/user/", isAuthenticated, getUser);
router.get("/dashboard", isAuthenticated, getDashboardStats);

export default router;
