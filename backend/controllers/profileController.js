import User from "../models/User.js";
import bcrypt from "bcryptjs";
// fetch user profile
export const getProfile = async (req , res) => {
    try {
        console.log("Frontend s profile request aayi hai")
        const user = await User.findById(req.user.id).select("-password -transactionPassword");
        if(!user){
            console.log("Error : req.user nahi mila!" )
            return res.status(404).json({ message : "User Not Found"});
            }
        console.log("User mil gya  , frotend ko data bhej ra hai");
        return res.status(200).json({ success : true,
            user : req.user
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error : error.message});
    }
};

// update profile info
export const updateProfile = async (req , res) => {
    try {
        const { name , mobile} = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name  , mobile},
            { new : true}
        ).select("-password  -transactionPassword");
        res.status(200).json({ success: true, message : "Profile Update SucessFully" , user})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error : error.message})
    }
};

// update password
export const updatePassword = async (req, res) => {
    try {
        const { type, oldPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user._id); 
        
        if (!user) return res.status(404).json({ message: "User Not Found" });

        if (type === "Login") {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: "Incorrect Old Password" });

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
        }
        // 🟢 YAHAN UPDATE KIYA HAI: 'transaction' ko 'Transaction' kar diya
        else if (type === 'Transaction') {
            
            // Agar pehle se password hai, tabhi purana password check karo
            if (user.transactionPassword) {
                const isMatch = await bcrypt.compare(oldPassword, user.transactionPassword);
                if (!isMatch) return res.status(400).json({ message: "Incorrect Old Transaction Password" });
            }
            
            const hashedTransactionPassword = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(req.user._id, { transactionPassword: hashedTransactionPassword });
            
        } else {
             // Agar "Login" ya "Transaction" ke ilawa kuch aaya toh ye error aayega
             return res.status(400).json({ message: "Invalid password type" });
        }

        res.status(200).json({ success: true, message: `${type} password updated successfully!` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
// Naya function : wallet address update krne k liye
export const updateWalletAddress = async (req , res) => {
    try {
        console.log("Frontend se ye data aaya:", req.body);
        const { walletAddress, transactionPassword} = req.body;
        if(!walletAddress || !transactionPassword){
            return res.status(400).json({ message : "Walletaddress and transactionpassword are required"})
        }

        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({ message : "User Not Found"})
        }

        if(user.transactionPassword){
            return res.status(400).json({ message : "Transaction Password id not set : please set  it first in profile  Settings"})
        };

        const isMatch = await bcrypt.compare(transactionPassword , user.transactionPassword);
        if(isMatch){
            return res.status(401).json({ message : " Incorrect Transaction Password!"})
        }

        user.usdtBep20Address = walletAddress;
        await user.save();
        return res.status(200).json({
            success : true,
            message : "Wallet Address saved Suessfully!",
            walletAddress : user.usdtBep20Address
        })
    } catch (error) {
        console.error("Update Wallet Error: " , error);
        return res.status(500).json({ message : "Server error while updating wallet"})
    }
};

export const setTransactionPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // 1. Check karein ki password aaya hai ya nahi
    if (!newPassword) {
      return res.status(400).json({ message: "Please provide a password." });
    }

    // 2. Password Strength Validation (Jo aapke UI me likha hai)
    // Rule: Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!\%*?&]{8,}$/;
    
    // if (!passwordRegex.test(newPassword)) {
    //   return res.status(400).json({ 
    //     message: "Password must be at least 8 characters and include a number, uppercase, lowercase & special character." 
    //   });
    // }

    // 3. User ko database se dhundhein
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Password ko secure (Hash) karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Database me save karein
await User.findByIdAndUpdate(req.user._id, { 
      transactionPassword: hashedPassword 
    });
    // 6. Success Response
    return res.status(200).json({ 
      success: true, 
      message: "Transaction Password secured and saved successfully!" 
    });

  } catch (error) {
    console.error("Set Transaction Password Error:", error);
    return res.status(500).json({ message: "Server error while saving password" });
  }
};