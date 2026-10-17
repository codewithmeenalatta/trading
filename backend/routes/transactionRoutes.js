import express from "express";
// 🟢 Puraani file ki jagah naye user controller ka naam likhein
import { getTransactions } from "../controllers/userTransactionController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();
router.get("/", isAuth, getTransactions);
export default router;