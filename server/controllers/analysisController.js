import Analysis from "../models/analysis.js";
import { scrapUrl } from "../services/scrapperService.js";
import { analyzeSEOData } from "../services/geminiService.js";

// Analyze a URL
export const analyzeUrl = async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ success: false, message: "URL is required" });
        }

        // Validate URL format
        let validUrl;
        try {
            validUrl = new URL(url).href.startsWith('http') ? new URL(url) : new URL(`https://${url}`);
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid URL format" });
        }

        const analysis = await Analysis.create({
            userId: req.userId,
            url: validUrl.href,
            status: "processing"
        });

        res.json({ success: true, message: "Analysis started", analysisId: analysis.id });

        // Run scraping and analysis in background
        try {
            // Step 1: Scrap the URL with Browserbase
            const scrapResult = await scrapUrl(validUrl.href);
            
            if (!scrapResult.success) {
                analysis.status = "failed";
                await analysis.save();
                return;
            }

            // Step 2: Gemini AI
            const aiResult = await analyzeSEOData(scrapResult.data);
            
            if (!aiResult || !aiResult.success) {
                analysis.status = "failed";
                await analysis.save();
                return;
            }

            // Step 3: Save result
            analysis.overallScore = aiResult.data.overallScore || 0;
            analysis.categories = aiResult.data.categories || {};
            analysis.metadata = scrapResult.data.metadata || scrapResult.data.metaData || {};
            analysis.headings = scrapResult.data.headings || {};
            analysis.links = scrapResult.data.links || {};
            analysis.images = scrapResult.data.images || {};
            analysis.keywords = aiResult.data.keywords;
            analysis.issues = aiResult.data.issues;
            analysis.loadTime = scrapResult.data.loadTime;
            analysis.pageSize = scrapResult.data.pageSize;
            analysis.wordCount = scrapResult.data.wordCount;
            analysis.status = "completed";
            
            await analysis.save();

        } catch (bgError) {
            console.error("background analysis error", bgError.message);
            try {
                analysis.status = "failed";
                await analysis.save();
            } catch (saveError) {
                console.error("failed to save failed status", saveError.message);
            }
        }
    } catch (error) {
        console.error("analyze url error", error.message);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
};

// Get Analysis by ID
export const getAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId });
        
        if (!analysis) {
            return res.status(404).json({ success: false, message: "Analysis not found" });
        }
        
        res.json({ success: true, analysis });
    } catch (error) {
        console.error("get analysis error", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all analyses of a user
export const getAnalyses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const analyses = await Analysis.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-issues -keywords");

        const total = await Analysis.countDocuments({ userId: req.userId });

        res.json({
            success: true,
            analyses, 
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("get analysis error", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete analysis
export const deleteAnalysis = async (req, res) => {
    try {
        const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        
        if (!analysis) {
            return res.status(404).json({ success: false, message: "Analysis not found" });
        }

        res.json({ success: true, message: "Analysis deleted" });
    } catch (error) {
        console.error("delete analysis error", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};