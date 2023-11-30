import express from "express";

import { login, register, refreshToken } from "../controllers/auth.js";
import { checkDuplicateEmail } from "../middlewares/SignUp.js";
import { verifyToken } from "../middlewares/authJwt.js";
  
const router = express.Router();

router.post("/login", login);
router.post("/register", checkDuplicateEmail, register);
router.post("/refreshToken", verifyToken, refreshToken)

export default router;