import express from "express";
import { verifyToken } from "../middlewares/authJwt.js";
import { isInCompany } from "../middlewares/index.js";
import { RejectCompanyInvite, LeaveCompany, CompanyAcceptInvite, CompanyCreateInvite } from "../controllers/user.js";
import { createCompany, deleteCompany, getCompanyInfo } from "../controllers/company.js";
import { getCompanyUsersById } from "../controllers/companyUser.js";
const router = express.Router();

router.post("/invite/reject/:company_id", verifyToken, RejectCompanyInvite);
router.post("/invite/accept/:company_id", verifyToken, CompanyAcceptInvite);
router.post("/invite/create/:company_id", verifyToken, isInCompany, CompanyCreateInvite);

router.post("/leave/:company_id", verifyToken, isInCompany, LeaveCompany);

router.post("/create/:company_id", verifyToken, createCompany);
router.delete("/delete/:company_id", verifyToken, isInCompany, deleteCompany);

router.get("/users/:company_id", verifyToken, isInCompany, getCompanyUsersById);
router.get("/:company_id", verifyToken, getCompanyInfo);

export default router;
