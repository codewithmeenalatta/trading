import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true, 
        enum: ['banner', 'popup'] // Yeh check karega ki type sirf 'banner' ya 'popup' ho
    },
    title: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    link: { 
        type: String // Agar image pe click karke kahin jana ho (optional)
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);