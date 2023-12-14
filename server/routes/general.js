import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";
import { isAuthenticated, isInCompany } from "../middlewares/index.js";
const router = express.Router();

router.get("/user/", isAuthenticated, getUser);
router.get("/dashboard/:company_id", isAuthenticated, isInCompany, getDashboardStats);

export default router;
