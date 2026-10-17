// File: backend/controllers/userTransactionController.js
import Transaction from "../models/Transaction.js";

// 🟢 Sirf User ke Transactions fetch karna
export const getTransactions = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        let query = { user: req.user._id };

        if (status && status !== 'All Statuses') {
            query.status = status.toUpperCase();
        }

        const skip = (page - 1) * limit;

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('user', 'name email'); 

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            totalTransactions: total
        });

    } catch (error) {
        console.error("Transaction Error:", error.message);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};