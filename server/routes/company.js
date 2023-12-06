import express from "express";
import { isInCompany, isAuthenticated } from "../middlewares/index.js";
import { RejectCompanyInvite, LeaveCompany, CompanyAcceptInvite, CompanyCreateInvite } from "../controllers/user.js";
import { createCompany, deleteCompany, getCompanyInfo } from "../controllers/company.js";
import { getCompanyUsersById } from "../controllers/companyUser.js";
const router = express.Router();

router.post("/invite/reject/:company_id", isAuthenticated, RejectCompanyInvite);
router.post("/invite/accept/:company_id", isAuthenticated, CompanyAcceptInvite);
router.post("/invite/create/:company_id", isAuthenticated, isInCompany, CompanyCreateInvite);

router.post("/leave/:company_id", isAuthenticated, isInCompany, LeaveCompany);

router.post("/create/:company_id", isAuthenticated, createCompany);
router.delete("/delete/:company_id", isAuthenticated, isInCompany, deleteCompany);

router.get("/users/:company_id", isAuthenticated, isInCompany, getCompanyUsersById);
router.get("/:company_id", isAuthenticated, getCompanyInfo);

export default router;
