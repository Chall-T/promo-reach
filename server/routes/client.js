import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../controllers/client.js";
import { isAuthenticated } from "../middlewares/index.js";
const router = express.Router();

router.get("/products", isAuthenticated, getProducts);
router.get("/customers", isAuthenticated, getCustomers);
router.get("/transactions", isAuthenticated, getTransactions);
router.get("/geography", isAuthenticated, getGeography);

export default router;
