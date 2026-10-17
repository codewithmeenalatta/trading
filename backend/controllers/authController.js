import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateGoldenId = async () => {
  let isUnique = false;
  let newGoldenId = "";
  
  while (!isUnique) {
    // Generates something like GOLD72849
    newGoldenId = "GOLD" + Math.floor(10000 + Math.random() * 90000);
    const existingId = await User.findOne({ goldenId: newGoldenId });
    if (!existingId) {
      isUnique = true;
    }
  }
  return newGoldenId;
};

export const register = async (req, res) => {
  try {
    // 1. Transaction password hata kar 'referralCode' liya gaya
    const { name, email, password, referralCode } = req.body;

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // 3. Referral Code Validation (Check ki kya kisi ne refer kiya hai?)
    let referrerId = null;
    
    if (referralCode) {
      // Agar referral code aaya hai, toh DB me dhoondo ki wo kiska Golden ID hai
      const referrer = await User.findOne({ goldenId: referralCode });
      
      if (!referrer) {
        // Agar code galat hai toh error de do
        return res.status(400).json({ message: "Invalid Referral Code" });
      }
      
      // Agar code sahi hai toh us user ki '_id' nikal lo taaki team link ho sake
      referrerId = referrer._id;
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 5. Naye user ke liye nayi Golden ID banayein
    const userGoldenId = await generateGoldenId();

    // 6. Create the new User
    const newUser = await User.create({
      name, 
      email, 
      password: hashedPassword,
      goldenId: userGoldenId,          // Uski khud ki Golden ID assign kar di
      referredBy: referrerId,          // Kisne usko joda uska ref id dal diya (null if direct joined)
      // Transaction password hat gaya, user use baad me Settings me banayega
    });

    newUser.password = undefined;

    res.status(201).json({ 
      success: true, 
      message: "Registration successful", 
      newUser 
    });
    
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id , role:user.role}, process.env.JWT_SECRET, { expiresIn: "7d" });

    // HTTP-only cookie me token set karna premium security ke liye
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production",
        sameSite : "Lax",
         maxAge : 7 * 24 * 60 * 60 * 1000
     });
       res.status(200).json({ message: "Login successful", role: user.role, token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req , res) => {
    try {
        res.clearCookie("token" , {
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "Lax"
        });
        res.status(200).json({ message : "Logged out sucessfully"})
    } catch (error) {
        res.status(500).json({ error : error.message});
    }
}