import express from 'express';
import { getContent, addContent, deleteContent, toggleStatus } from '../controllers/contentController.js';
import { isAuth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Sirf admin access kar sakta hai inko
router.get('/', isAuth, isAdmin, getContent);
router.post('/add', isAuth, isAdmin, addContent);
router.delete('/:id', isAuth, isAdmin, deleteContent);
router.put('/:id/toggle', isAuth, isAdmin, toggleStatus);

export default router;