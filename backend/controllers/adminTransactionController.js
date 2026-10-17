// File: backend/controllers/adminTransactionController.js
import Transaction from "../models/Transaction.js";
import User from "../models/User.js"; 

// 🔴 1. Get All Transactions (Admin)
export const getAllTransactions = async (req, res) => {
  try {
    const { status, type, fromDate, toDate } = req.query;

    let query = {};
    if (status && status !== "ALL") query.status = status;
    if (type && type !== "ALL") query.type = type;
    
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        let endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    const transactions = await Transaction.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔴 2. Get Pending Withdrawals (Admin)
export const getPendingWithdrawals = async (req, res) => {
  try {
    const pendingRequests = await Transaction.find({ 
      type: "WITHDRAWAL", 
      status: "PENDING" 
    })
    .populate("user", "name email goldenId") 
    .sort({ createdAt: -1 });

    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔴 3. Process Withdrawal (Admin)
export const processWithdrawal = async (req, res) => {
  try {
    const { transactionId, action } = req.body; 

    const trx = await Transaction.findById(transactionId);
    if (!trx) return res.status(404).json({ message: "Transaction not found" });

    if (trx.status !== "PENDING") {
      return res.status(400).json({ message: "Transaction is already processed" });
    }

    const user = await User.findById(trx.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === 'APPROVED') {
      trx.status = 'COMPLETED';
      trx.actionText = 'Reviewed & Approved';
    } 
    else if (action === 'REJECTED') {
      trx.status = 'REJECTED';
      trx.actionText = 'Reviewed & Rejected (Refunded)';
      
      const refundAmount = Math.abs(trx.amount);
      
      // Note: Agar aapne naya 'Wallet' schema use karna shuru kar diya hai, 
      // toh aage chalkar isko 'User' ki jagah 'Wallet' model se update kar lena.
      if (trx.wallet === "MAIN") {
        user.mainWallet += refundAmount;
      } else if (trx.wallet === "TRADE") {
        user.tradeWallet += refundAmount;
      } else if (trx.wallet === "AFFLIATE") {
         user.affiliateWallet = (user.affiliateWallet || 0) + refundAmount; 
      }
      
      await user.save();
    } 
    else {
       return res.status(400).json({ message: "Invalid action. Use APPROVED or REJECTED." });
    }

    await trx.save();
    res.status(200).json({ message: `Withdrawal request ${trx.status} successfully`, trx });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};