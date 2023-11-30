import express from "express";
import { getSales } from "../controllers/sales.js";
import { verifyToken } from "../middlewares/authJwt.js";
const router = express.Router();

router.get("/sales", verifyToken, getSales);

export default router;
