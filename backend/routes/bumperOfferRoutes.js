import express from "express";
import { getAllBumperOffers, createBumperOffer, updateOfferStatus } from "../controllers/bumperOfferController.js";
// import { isAdmin, isAuth } from "../middleware/authMiddleware.js"; // Aapke existing middleware

import { isAdmin , isAuth } from "../middleware/auth.js";
const router = express.Router();

// Admin routes
router.get("/all", isAuth, isAdmin, getAllBumperOffers);
router.post("/create", isAuth, isAdmin, createBumperOffer);
router.put("/update-status", isAuth, isAdmin, updateOfferStatus);

export default router;