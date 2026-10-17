// File: backend/controllers/userTicketController.js
import Ticket from '../models/Ticket.js';

// 1. Naya Ticket Banana (Sirf User ke liye)
export const createTicket = async (req, res) => {
    try {
        const { subject, priority, description } = req.body;
        const userId = req.user._id || req.user.id; 

        if (!subject || !priority || !description) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const newTicket = await Ticket.create({
            userId, 
            subject, 
            priority,
            description
        });

        res.status(201).json({ message: "Ticket created successfully!", ticket: newTicket });
    } catch (error) {
        console.error("Ticket Creation Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2. User ke khud ke tickets lana
export const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.user._id || req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};