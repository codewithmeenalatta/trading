import cron from 'node-cron';
import Investment from '../models/Investment.js';
import User from '../models/User.js';

export const startROIJob = () => {
  // '30 5 * * 1-5' ka matlab hai:
  // 30 = Minute, 5 = Hour (Subah 5:30 AM)
  // 1-5 = Monday (1) se Friday (5) tak chalega (Saturday-Sunday off)
  cron.schedule('30 5 * * 1-5', async () => {
    console.log("Running Daily ROI Distribution at 5:30 AM...");

    try {
      // Sirf un investments ko find karo jo abhi 'active' hain (jinka 3x pura nahi hua)
      const activeInvestments = await Investment.find({ status: 'active' });

      if (activeInvestments.length === 0) {
        console.log("No active investments found for ROI distribution today.");
        return;
      }

      for (let inv of activeInvestments) {
        // Daily return 10% nikalna
        let dailyROI = inv.investedAmount * 0.10; 
        
        // Check karna ki 3x limit poori hone me kitna bacha hai
        let remainingSpace = inv.maxReturn - inv.earnedAmount;

        // Agar bacha hua amount dailyROI se kam ya barabar hai, 
        // to sirf bacha hua amount do aur cycle close (completed) kar do
        if (remainingSpace <= dailyROI) {
           dailyROI = remainingSpace; 
           inv.status = 'completed'; 
        }

        // Investment me kamaya hua amount update karo (Progress bar ke liye)
        inv.earnedAmount += dailyROI;
        await inv.save();

        // User ke Main Wallet me ROI ka amount credit kar do
        await User.findByIdAndUpdate(inv.user, {
           $inc: { mainWallet: dailyROI }
        });
      }
      
      console.log(`Successfully distributed ROI to ${activeInvestments.length} users!`);
    } catch (error) {
      console.error("Error in ROI Cron Job:", error);
    }
  });
};