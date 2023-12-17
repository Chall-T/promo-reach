import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../controllers/client.js";
import { isAuthenticated, isInCompany } from "../middlewares/index.js";
const router = express.Router();

router.get("/products", isAuthenticated, getProducts);
router.get("/customers/:company_id", isAuthenticated, isInCompany, getCustomers);
router.get("/transactions/:company_id", isAuthenticated, isInCompany, getTransactions);
router.get("/geography", isAuthenticated, getGeography);

export default router;
