import Document from "../models/Document.js";

// 1. Sabhi uploaded KYC documents fetch karna (Admin Panel ke liye)
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Document Status Update karna (APPROVED / REJECTED)
export const updateDocumentStatus = async (req, res) => {
  try {
    const { docId, status } = req.body; // status: 'APPROVED' or 'REJECTED'

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      docId,
      { status },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: `Document status updated to ${status}`, updatedDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};