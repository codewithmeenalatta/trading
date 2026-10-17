import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js'; // 🟢 Dhyan dein: Wallet model zaroori hai

// ==========================================
// 1. DEPOSIT SECTION (Aapka banaya hua sahi code)
// ==========================================
export const requestDeposit = async (req, res) => {
    try {
        const { amount } = req.body;
        const depositAmount = Number(amount);

        if (!depositAmount || depositAmount < 10) return res.status(400).json({ message: "Minimum deposit is $10" });

        const transaction = await Transaction.create({
            user: req.user._id,
            wallet: "TRADE",
            type: "DEPOSIT",
            amount: depositAmount,
            status: "PENDING",
            description: `Deposit request generated for $${depositAmount} USDT`,
        });

        res.status(200).json({
            success: true,
            transactionId: transaction._id,
            payAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", 
            message: "Deposit address generated successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error while generating deposit address" });
    }
};

export const submitDepositHash = async (req, res) => {
    try {
        const { transactionId, hashId } = req.body;
        if (!hashId) return res.status(400).json({ message: "Transaction Hash is required" });

        await Transaction.findByIdAndUpdate(transactionId, {
            hashId: hashId,
            description: `Deposit pending admin approval (Hash: ${hashId})`
        });

        res.status(200).json({ message: "Deposit request submitted! Waiting for Admin approval." });
    } catch (error) {
        res.status(500).json({ message: "Server error while submitting hash" });
    }
};

// ==========================================
// 2. WITHDRAW & BALANCE SECTION (Naya Code)
// ==========================================

// User ko uska total balance dikhane ke liye
export const getWalletBalance = async (req, res) => {
    try {
        let wallet = await Wallet.findOne({ user: req.user._id });
        if (!wallet) {
            wallet = await Wallet.create({ user: req.user._id }); // Naya account ho to bana do
        }
        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch wallet balances" });
    }
};

// Paise nikalne ki request (Withdraw)
export const requestWithdrawal = async (req, res) => {
    try {
        const { amount, walletType, cryptoAddress } = req.body;
        const withdrawAmount = Number(amount);

        if (withdrawAmount < 20) return res.status(400).json({ message: "Minimum withdrawal is 20 USDT" });
        if (!cryptoAddress) return res.status(400).json({ message: "Crypto address is required" });

        const wallet = await Wallet.findOne({ user: req.user._id });
        
        // 1. Check karo balance hai ya nahi
        if (wallet[walletType] < withdrawAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // 2. Wallet se balance turant kaat lo
        wallet[walletType] -= withdrawAmount;
        await wallet.save();

        // 3. Admin ko dikhane ke liye PENDING transaction bana do
        await Transaction.create({
            user: req.user._id,
            wallet: walletType === 'tradeBalance' ? 'TRADE' : walletType === 'mainBalance' ? 'MAIN' : 'AFFILIATE',
            type: "WITHDRAWAL",
            amount: -withdrawAmount, // Withdraw minus me dikhta hai
            status: "PENDING",
            description: `Withdrawal request to ${cryptoAddress}`,
        });

        res.status(200).json({ message: "Withdrawal request submitted! Pending admin approval." });
    } catch (error) {
        res.status(500).json({ message: "Server error during withdrawal request" });
    }
};