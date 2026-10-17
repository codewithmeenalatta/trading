// File: backend/routes/userTicketRoutes.js
import express from 'express';
import { createTicket, getUserTickets } from '../controllers/userTicketController.js';
import { isAuth , isUser } from '../middleware/auth.js';
const router = express.Router();

// User ke routes
router.post('/create',isAuth , isUser, createTicket);
router.get('/my-tickets',isAuth,isUser , getUserTickets);

export default router;