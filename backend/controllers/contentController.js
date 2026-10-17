import Content from '../models/Content.js';

// Get all content based on type (banner/popup)
export const getContent = async (req, res) => {
    try {
        const { type } = req.query; // ?type=banner ya ?type=popup
        const filter = type ? { type } : {};
        const content = await Content.find(filter).sort({ createdAt: -1 });
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add new banner or popup
export const addContent = async (req, res) => {
    try {
        const { type, title, imageUrl, link } = req.body;
        
        if(!type || !title || !imageUrl) {
            return res.status(400).json({ message: "Type, title and Image URL are required" });
        }

        const newContent = await Content.create({ type, title, imageUrl, link });
        res.status(201).json({ message: `${type} added successfully`, data: newContent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a banner or popup
export const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        await Content.findByIdAndDelete(id);
        res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle active status (On/Off without deleting)
export const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Content.findById(id);
        content.isActive = !content.isActive;
        await content.save();
        res.status(200).json({ message: "Status updated", data: content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};