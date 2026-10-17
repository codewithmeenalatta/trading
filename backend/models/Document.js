import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  documentType: {
    type: String, // e.g., "Aadhaar Card", "PAN Card", "Passport"
    default: "Identity Proof"
  },
  documentUrl: {
    type: String, // Cloudinary ya local file url
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);