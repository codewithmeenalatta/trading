import Transaction from "../models/Transaction.js";
import Investment from "../models/Investment.js";
import Content from "../models/Content.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// 1. Dashboard Data (Saare wallets, investments, aur recent transactions ek sath)
export const getDashboardData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
       return res.status(401).json({ message: "User not recognized by token" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    // User ki investments fetch karein
    const investments = await Investment.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Recent 10 transactions fetch karein
    const recentTransactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

      const activeBanners = await Content.find({ type: 'banner', isActive: true }).sort({ createdAt: -1 });

    const hasTransactionPassword = user.transactionPassword && user.transactionPassword.length > 0;

    // 🟢 REAL ROI CALCULATIONS (Koi Dummy data nahi)
    const myInvestment = user.myInvestment || 0;
    const roiTarget = myInvestment * 3;          // Hamesha investment ka 3 guna (3X) hoga
    const roiCompleted = user.totalIncome || 0;  // Jitni total income hui hai wahi completed roi hai
const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const myGoldenId = user.goldenId || "";
const dynamicReferralLink = `${baseUrl}/register?referral=${myGoldenId}`;
console.log("Banaya hua Link:", dynamicReferralLink);
    // Progress bar ka percentage calculate karna (Max 100% ho sakta hai)
    const progressPercent = roiTarget > 0 ? (roiCompleted / roiTarget) * 100 : 0;

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        goldenId: user.goldenId || user.kyc?.goldenId || "GOLD" + user._id.toString().substring(0, 6).toUpperCase(),
referralLink: dynamicReferralLink,
        mainWallet: user.mainWallet || 0,
        tradeWallet: user.tradeWallet || 0,
        generationWallet: user.generationWallet || 0,
        myInvestment: myInvestment,
        totalIncome: user.totalIncome || 0,
        totalWithdrawal: user.totalWithdrawal || 0,
        teamTurnover: user.teamTurnover || 0,
        powerLeg: user.powerLeg || 0,
        otherLeg: user.otherLeg || 0,
        referralBonus: user.referralBonus || 0,
        newBusiness: user.newBusiness || 0,
        
        // 🟢 Naye Calculated fields Frontend ko bhej rahe hain
        roiTarget: roiTarget,
        roiCompleted: roiCompleted,
        progressPercent: progressPercent
      },
      investments,
      recentTransactions,
      activeBanners,
      hasTransactionPassword 
    });
  } catch (error) {
    console.error("Dashboard Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Deposit request lagana
export const requestDeposit = async (req, res) => {
    try {
        const { amount } = req.body;
        await Transaction.create({ user: req.user.id, type: "deposit", amount, status: "PENDING" });
        res.status(201).json({ message: "Deposit request sent to admin successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Trade wallet se Invest karna (3x limit ke sath)
export const investMoney = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user.id);
        
        if (user.tradeWallet < amount) {
            return res.status(400).json({ message: "Insufficient balance in Trade Wallet" });
        }
        
        user.tradeWallet -= amount;
        user.myInvestment = (user.myInvestment || 0) + Number(amount);
        await user.save();

        await Investment.create({
            user: req.user.id,
            investedAmount: amount,
            maxReturn: amount * 3
        });

        res.status(200).json({ message: "Investment successful!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Withdraw request (Transaction Password check ke sath)
export const requestWithdraw = async (req, res) => {
    try {
        const { amount, transactionPassword } = req.body;
        const user = await User.findById(req.user.id).select("+transactionPassword");

        if (!user.transactionPassword) {
            return res.status(400).json({ message: "Please set your transaction password first!" });
        }

        const isMatch = await bcrypt.compare(transactionPassword, user.transactionPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Transaction Password!" });
        }

        if (user.mainWallet < amount) {
            return res.status(400).json({ message: "Insufficient balance in Main Wallet" });
        }

        user.mainWallet -= amount;
        user.totalWithdrawal = (user.totalWithdrawal || 0) + Number(amount);
        await user.save();

        await Transaction.create({ user: req.user.id, type: "withdraw", amount, status: "PENDING" });
        
        res.status(200).json({ message: "Withdraw request submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Set Transaction Password
export const setTransactionPassword = async (req, res) => {
  try {
    const { transactionPassword } = req.body;
    const hashedTxPassword = await bcrypt.hash(transactionPassword, 10);

    await User.findByIdAndUpdate(req.user.id, {
      transactionPassword: hashedTxPassword
    });

    res.status(200).json({ message: "Transaction Password set successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};