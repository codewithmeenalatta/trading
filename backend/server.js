import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes & Utils imports
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bumperOfferRoutes from "./routes/bumperOfferRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import walletRoutes from './routes/walletRoutes.js'; // Wallet Import kiya hua hai
import userTicketRoutes from './routes/userTicketRoutes.js';
import transactionRoutes from "./routes/transactionRoutes.js"; 
import adminTransactionRoutes from "./routes/adminTransactionRoutes.js"; 
import { startROIJob } from "./utils/cronJobs.js";

// 1. Config and Initialization
dotenv.config();
const app = express(); 

// 2. Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "https://trade-dash-nine.vercel.app", credentials: true }));

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

// 4. Routes Configuration
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/bumper-offers", bumperOfferRoutes);
app.use("/api/admin/documents" , documentRoutes );
app.use("/api/admin/content", contentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/profile" , profileRoutes);
app.use('/api/trade', tradeRoutes); 

// 🟢 NAYA ADD KIYA: Wallet ka rasta
app.use('/api/wallet', walletRoutes);
app.use('/api/tickets', userTicketRoutes);

// 🔴 THEEK KIYA: Admin ka transaction alag, User ka transaction alag
app.use("/api/admin/transactions", adminTransactionRoutes); // Sirf Admin
app.use("/api/transactions", transactionRoutes); // Sirf User

// 5. Start Automated Background Job
startROIJob();

// 6. Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});