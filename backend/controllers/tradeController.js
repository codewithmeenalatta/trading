import User from "../models/User.js";

// user ko current balance bhejna
export const getTradeBalance = async (req , res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ message : "User Not Found"})
        
        res.status(200).json({ availableBalance: user.availableBalance || 0 })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message : "Server Error while fetching balance."})
    }
};

// Nayi trade lagana
export const submitTrade = async ( req , res) => {
    try {
        const { amount } = req.body;
        const tradeAmount = Number(amount);
        
        if(!tradeAmount || tradeAmount < 1){
            return res.status(400).json({ message : "Minimum trade amount is $1"})
        }

        // 🟢 UPDATE 1: req.body._id ki jagah req.user._id kiya hai
        const user = await User.findById(req.user._id);
        
        if(user.availableBalance < tradeAmount){
            return res.status(400).json({ message : "Insufficient balance for this trade."})
        }

        // 🟢 UPDATE 2: Chote 'user' ki jagah bada 'User' aur 'findByIdAndUpdate' function lagaya hai
        await User.findByIdAndUpdate(req.user._id , {
            $inc: {
                availableBalance : -tradeAmount,
                activeTradeBalance : tradeAmount
            }
        });

        res.status(200).json({
            success: true, 
            message: `Trade of $${tradeAmount} deployed successfully!`,
            newBalance: user.availableBalance - tradeAmount
        })
    } catch (error) {
        console.error(error.message)
        // Ek choti si spelling theek ki hai: 'rade' ko 'Trade' kar diya
        res.status(500).json({ message : "Trade failed due to server error"}) 
    }
}