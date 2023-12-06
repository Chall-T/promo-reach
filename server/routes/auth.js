import express from "express";

import { login, register, logOut } from "../controllers/auth.js";
import { checkDuplicateEmail } from "../middlewares/SignUp.js";
import { isAuthenticated } from "../middlewares/index.js";
  
const router = express.Router();

router.post("/login", login);
router.post("/register", checkDuplicateEmail, register, login);
router.post("/logout", isAuthenticated, logOut);

export default router;