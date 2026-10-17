import express from "express";
import { isAuth} from "../middleware/auth.js";
import { getTradeBalance, submitTrade } from "../controllers/tradeController.js";
const router = express.Router();
router.get('/balance' , isAuth , getTradeBalance );
router.post('/submit' , isAuth , submitTrade);
export default router;