import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ['LOW', 'MEDIUM', 'HIGH'], 
        default: 'MEDIUM' 
    },
    status: { 
        type: String, 
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], 
        default: 'OPEN' 
    }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);