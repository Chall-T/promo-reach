import express from "express";
import { getAdmins, getUserPerformance } from "../controllers/management.js";
import { isAuthenticated } from "../middlewares/index.js";
const router = express.Router();

router.get("/admins", isAuthenticated, getAdmins);
router.get("/performance/", isAuthenticated, getUserPerformance);

export default router;
