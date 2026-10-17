import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  wallet: {
    type: String, // e.g., "TRADE", "MAIN", "AFFILIATE", "BUSD"
    required: true
  },
  type: {
    type: String, // e.g., "DEPOSIT", "WITHDRAWAL", "FUND-TRANSFER", "SWAP", "ROI_REWARD"
    required: true
  },
  amount: {
    type: Number, // +8000 (credit) or -8000 (debit)
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "REJECTED"],
    default: "PENDING"
  },
  hashId: {
    type: String, // UTR or Blockchain Hash
    default: "N/A"
  },
  description: {
    type: String, // e.g., "Received 8000 TRADE from Anjila..."
    required: true
  },
  actionText: {
    type: String, 
    default: "Processed" // Buttons or Text like "Processed", "View"
  }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);