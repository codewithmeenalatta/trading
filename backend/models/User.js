import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Basic Details
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
transactionPassword: {
    type: String,
    default: "", // Default khali rahega jab tak user set na kare
  },  
  // Custom ID for Referrals
  goldenId: { type: String, unique: true, sparse: true }, 

  // Wallets
  tradeWallet: { type: Number, default: 0 },
  mainWallet: { type: Number, default: 0 },
  generationWallet: { type: Number, default: 0 },

  // Investment & ROI Tracking
  myInvestment: { type: Number, default: 0 },    // User ka total invested amount
  totalIncome: { type: Number, default: 0 },     // Aaj tak ki kamayi hui total income
  totalWithdrawal: { type: Number, default: 0 }, // Aaj tak kitna withdraw kiya

  // Network / Referral Tracking
  teamTurnover: { type: Number, default: 0 },
  powerLeg: { type: Number, default: 0 },
  otherLeg: { type: Number, default: 0 },
  referralBonus: { type: Number, default: 0 },
  newBusiness: { type: Number, default: 0 },
  usdtBep20Address : { type : String, default : ""},
  availableBalance : { type : Number , default : 0},
  activeTradeBalance : { type : Number , default : 0},

  // System Role
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);