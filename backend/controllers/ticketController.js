import Ticket from '../models/Ticket.js';

// Admin: Get All Tickets (with User details populated)
export const getAllTickets = async (req, res) => {
    try {
        const { status, priority } = req.query; // Filters ke liye
        
        let filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        // Populate se hume user ka naam aur email mil jayega
        const tickets = await Ticket.find(filter)
            .populate('userId', 'name email kyc.goldenId') 
            .sort({ createdAt: -1 });

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Update Ticket Status
export const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        res.status(200).json({ message: "Ticket status updated", data: ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// USER API (Aapke reference ke liye - jisse user ticket create karega)
export const createTicket = async (req, res) => {
    try {
        const { subject, description, priority } = req.body;
        const newTicket = await Ticket.create({
            userId: req.user._id, // User token se aayega
            subject,
            description,
            priority
        });
        res.status(201).json({ message: "Ticket created", data: newTicket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};