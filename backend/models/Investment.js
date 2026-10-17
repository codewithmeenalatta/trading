// import mongoose from "mongoose";

// const investmentSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   investedAmount: { type: Number, required: true },
//   maxReturn: { type: Number, required: true }, // investedAmount * 3 (3x limit)
//   earnedAmount: { type: Number, default: 0 },  // Kitna mil chuka hai
//   status: { type: String, enum: ['active', 'completed'], default: 'active' }
// }, { timestamps: true });

// export default mongoose.model("Investment", investmentSchema);


import mongoose from "mongoose";
const investmentSchema = new mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
    investedAmount : { type : Number , required : true},
    maxReturn : { type : Number , required : true},
    earnedAmount : { type : Number , default : 0},
    status : {type : String , enum : ['active' , 'completed'] , default : 'active' }
} , { timestamps : true});
export default mongoose.model("Investment" , investmentSchema);