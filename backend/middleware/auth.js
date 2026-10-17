import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. IS-AUTH: Sirf ye check karta hai ki user logged in hai ya nahi
export const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.cookies?.authorization;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
       console.log("No token found in cookies or headers");
       return res.status(401).json({ message: "No token, authorization denied" });
    }

    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
       return res.status(401).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.log("Token verification failed!", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// 2. IS-USER: Ye check karta hai ki logged-in insaan normal user hai ya nahi
export const isUser = (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.log("User Verify Fail: Role missing."); 
    return res.status(403).json({ message: "Access denied. Role missing." });
  }

  // Yahan 'user' role check kar rahe hain
  if (req.user.role === "user") {
    next();
  } else {
    console.log("User Verify Fail: This account is not a normal user."); 
    res.status(403).json({ message: "Access denied. Regular User only." });
  }
};

// 3. IS-ADMIN: Ye check karta hai ki logged-in insaan admin hai ya nahi
export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    console.log("Admin Verify Fail: Role missing."); 
    return res.status(403).json({ message: "Access denied. Role missing." });
  }

  // Yahan 'admin' role check kar rahe hain
  if (req.user.role === "admin") {
    next();
  } else {
    console.log("Admin Verify Fail: This account is not an admin."); 
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};