import express from "express";
// 🔴 Naye admin controller ka naam likhein
import { 
    getAllTransactions, 
    getPendingWithdrawals, 
    processWithdrawal 
} from "../controllers/adminTransactionController.js";
import { isAuth, isAdmin } from "../middleware/auth.js";

const router = express.Router();
router.get("/all", isAuth, isAdmin, getAllTransactions);
router.get("/pending-withdrawals", isAuth, isAdmin, getPendingWithdrawals);
router.post("/process-withdrawal", isAuth, isAdmin, processWithdrawal);
export default router;