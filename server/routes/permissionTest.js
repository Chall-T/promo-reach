import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";
import { moderatorBoard, allAccess, adminBoard, userBoard } from "../controllers/client.js";
import express from "express";


const router = express.Router();

router.get("/all", allAccess);

router.get("/user", verifyToken, userBoard);

router.get("/mod", verifyToken, isModerator, moderatorBoard);

router.get("/admin", verifyToken, isAdmin, adminBoard );

export default router;