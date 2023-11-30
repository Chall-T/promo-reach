import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../controllers/client.js";
import { verifyToken } from "../middlewares/authJwt.js";
const router = express.Router();

router.get("/products", verifyToken, getProducts);
router.get("/customers", verifyToken, getCustomers);
router.get("/transactions", verifyToken, getTransactions);
router.get("/geography", verifyToken, getGeography);

export default router;
