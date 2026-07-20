import KeywordTracking from "../models/keywordTracking.js";
import { keywordTracking } from "../services/keywordTrackingService.js";

// Add keyword to track
export const addKeyword = async (req, res) => { // FIXED: Changed (params) to (req, res)
    try {
        const { keyword, url } = req.body;
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        
        if (!keyword || !url) {
            return res.status(400).json({ success: false, message: 'Keyword and URL are required' });
        }
        
        // Extract domain from url
        let domain;
        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`); // FIXED: Changed to https
            domain = urlObj.hostname.replace('www.', ''); // Aligned with the video's replace method
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid URL format' });
        }

        // Check if keyword already exists for user
        const existingKeyword = await KeywordTracking.findOne({ 
            userId, 
            keyword: keyword.toLowerCase().trim(), 
            domain 
        });
        
        if (existingKeyword) {
            return res.status(400).json({ success: false, message: 'Already tracking this keyword for this domain' });
        }

        // Create new keyword tracking entry
        const tracking = await KeywordTracking.create({
            userId,
            keyword: keyword.toLowerCase().trim(),
            url: url.startsWith('http') ? url : `https://${url}`,
            domain,
            status: 'checking',
        });
        
        res.status(201).json({ success: true, message: 'Keyword tracking started', tracking });

        keywordTracking(tracking);
    } catch (error) {
        console.error('Error adding keyword:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Already tracking this keyword' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
        // FIXED: Removed throw error; to prevent server crashes
    }
};

// Get all keywords for a user
export const getKeywords = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const keywords = await KeywordTracking.find({ userId })
            .sort({ createdAt: -1 })
            .select("-rankHistory");
        
        res.json({ success: true, keywords });
    } catch (error) {
        console.error('Error getting keywords:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get single keyword for a user
export const getKeyword = async (req, res) => {
     try {
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const tracking = await KeywordTracking.findOne({ _id: req.params.id, userId });
        
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        
        res.json({ success: true, tracking });
    } catch (error) {
        console.error('Error getting keyword:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Manually refresh a keyword for a user
export const refreshKeyword = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const tracking = await KeywordTracking.findOne({ _id: req.params.id, userId });
        
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        
        tracking.status = 'checking';
        await tracking.save();
        
        res.json({ success: true, message: 'Rank check started' });
        
        keywordTracking(tracking);
    } catch (error) {
        console.error('Error refreshing keyword:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a keyword for a user
export const deleteKeyword = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const tracking = await KeywordTracking.findOneAndDelete({ _id: req.params.id, userId });
        
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        
        res.json({ success: true, message: 'Keyword tracking deleted' });
    } catch (error) {
        console.error('Error deleting keyword:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Toggle tracking active/inactive status for a keyword
export const toggleTracking = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const tracking = await KeywordTracking.findOne({ _id: req.params.id, userId });
        
        if (!tracking) {
            return res.status(404).json({ success: false, message: 'Keyword tracking not found' });
        }
        
        tracking.active = !tracking.active;
        await tracking.save();
        
        res.json({ success: true, tracking });
    } catch (error) {
        console.error('Error toggling keyword:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};