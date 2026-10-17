import express from "express";
import { isAuth , isAdmin } from "../middleware/auth.js";
import { getPendingDeposits , handleDEpositStatus  , getAllUsersList} from "../controllers/adminController.js";
const router = express.Router();
router.get('/deposits' , isAuth , isAdmin , getPendingDeposits);
router.post('/deposits-action' , isAuth , isAdmin , handleDEpositStatus);
router.get("/all-users", isAuth , isAdmin, getAllUsersList);
export default router;