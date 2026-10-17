import mongoose from "mongoose";

const bumperOfferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true // e.g. "Gold", "Diamond", etc.
  },
  business: {
    type: Number,
    required: true // Team turnover or business volume
  },
  reward: {
    type: String,
    required: true // e.g. "iPhone 15", "$500 Cash"
  },
  status: {
    type: String,
    enum: ["Pending", "Achieved", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("BumperOffer", bumperOfferSchema);