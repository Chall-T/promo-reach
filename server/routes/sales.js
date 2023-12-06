import express from "express";
import { getSales } from "../controllers/sales.js";
import { isAuthenticated } from "../middlewares/index.js";
const router = express.Router();

router.get("/sales", isAuthenticated, getSales);

export default router;
