import express from 'express';
import { getAllTickets, updateTicketStatus, createTicket } from '../controllers/ticketController.js';
import { isAuth, isAdmin, isUser } from '../middleware/auth.js';

const router = express.Router();

// 🟢 ADMIN ROUTES
router.get('/all', isAuth, isAdmin, getAllTickets);
router.put('/update/:id', isAuth, isAdmin, updateTicketStatus);

// 🟢 USER ROUTES (Jahan se user complain bhejta hai)
router.post('/create', isAuth, isUser, createTicket);

export default router;