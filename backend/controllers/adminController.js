import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// Pending deposit requests dekhna
export const getPendingDeposits = async (req , res) => {
    try {
        const deposit = await Transaction.find({ type : "deposit" , status : "pending"}).populate("user" , "name email");
        res.status(200).json(deposit);
    } catch (error) {
        res.status(500).json({ error : error.message});
    }
};

// Deposit Accept ya Decline karna

export const handleDEpositStatus = async (req , res) => {
    try {
        const { transactionId , status} = req.body;
        const transaction = await Transaction.findById(transactionId);
        if(!transaction || transaction.status !== "pending" ){
            return res.status(400).json({ message : "Invalid or already processed transaction"})
        }
        transaction.status = status;
        await transaction.save();
        if(status === "accepted"){
            await User.findByIdAndUpdate(transaction.user , {
                $inc : { tradeWallet : transaction.amount}
            });
        }
        res.status(200).json({ message : `Deposite request ${status} sucessfully`})
    } catch (error) {
        console.log(500).json({ error : error.message});
    }
};

export const getAllUsersList = async (req, res) => {
  try {
    // Sirf 'user' role walo ko layenge, aur security ke liye password hide kar denge
    const users = await User.find({ role: 'user' }).select('-password -transactionPassword').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
};