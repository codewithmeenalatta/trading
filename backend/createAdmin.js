import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createMasterAdmin = async () => {
  try {
    // 1. Database se connect karein
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected!");

    // 2. Check karein ki Admin pehle se to nahi bana hua hai
    const adminEmail = "admin@tradepro.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("Master Admin pehle se database me maujud hai!");
      process.exit();
    }

    // 3. Admin ka Password Hash karein (Security ke liye)
    const hashedPassword = await bcrypt.hash("Admin@1234", 10);
    const hashedTxPassword = await bcrypt.hash("Tx@1234", 10); // Schema me ye required hai isliye dummy dal rahe hain

    // 4. Admin account Database me save karein
    const adminUser = new User({
      name: "Master Admin",
      email: adminEmail,
      password: hashedPassword,
      transactionPassword: hashedTxPassword,
      role: "admin" // Ye sabse main part hai
    });

    await adminUser.save();
    console.log("✅ Master Admin account successfully ban gaya hai!");
    console.log("👉 Email: admin@tradepro.com");
    console.log("👉 Password: Admin@1234");
    
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createMasterAdmin();