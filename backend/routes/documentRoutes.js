import express from "express";
import { getAllDocuments, updateDocumentStatus } from "../controllers/documentController.js";
import { isAdmin, isAuth } from "../middleware/auth.js";


const router = express.Router();

// Admin routes for managing user KYC documents
router.get("/all", isAuth, isAdmin, getAllDocuments);
router.put("/update-status", isAuth, isAdmin, updateDocumentStatus);

export default router;