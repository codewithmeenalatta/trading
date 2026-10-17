import BumperOffer from "../models/BumperOffer.js";

// 1. Sabhi Bumper Offers fetch karna (Admin Panel ke liye)
export const getAllBumperOffers = async (req, res) => {
  try {
    const offers = await BumperOffer.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Naya Bumper Offer record add karna (Admin ya Auto-system ke liye)
export const createBumperOffer = async (req, res) => {
  try {
    const { userId, mobile, rank, business, reward, status } = req.body;

    const newOffer = await BumperOffer.create({
      user: userId,
      mobile,
      rank,
      business,
      reward,
      status: status || "Pending"
    });

    res.status(201).json({ message: "Bumper offer record added successfully", newOffer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Offer ka status update karna (Pending se Achieved karne ke liye)
export const updateOfferStatus = async (req, res) => {
  try {
    const { offerId, status } = req.body; // status: 'Achieved' or 'Rejected'

    const updated = await BumperOffer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Offer record not found" });

    res.status(200).json({ message: "Offer status updated successfully", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};