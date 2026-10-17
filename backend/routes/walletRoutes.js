import express from 'express';
import { isAuth } from '../middleware/auth.js';
import { requestDeposit, submitDepositHash , getWalletBalance , requestWithdrawal} from '../controllers/walletController.js';

const router = express.Router();

// User Wallet Routes
router.post('/deposit/request', isAuth, requestDeposit);
router.post('/deposit/submit-hash', isAuth, submitDepositHash);

router.get('/balance' , isAuth , getWalletBalance);
router.post('/withdraw/request' , isAuth , requestWithdrawal);
export default router;