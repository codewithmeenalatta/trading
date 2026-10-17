import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Ek user ka ek hi main wallet account hoga
    },
    // 🟢 Alag-alag type ke balances (Aapke Transaction type ke hisaab se)
    tradeBalance: {
        type: Number,
        default: 0
    },
    affiliateBalance: {
        type: Number,
        default: 0
    },
    mainBalance: {
        type: Number,
        default: 0
    },
    
    // 🟢 User ke khud ke Crypto Wallet Addresses (Withdrawal ke liye)
    bep20Address: {
        type: String,
        default: '' // Binance Smart Chain address
    },
    trc20Address: {
        type: String,
        default: '' // Tron Network address
    },
    
    // Wallet Active hai ya block kar diya gaya hai admin dwara
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Wallet', walletSchema);