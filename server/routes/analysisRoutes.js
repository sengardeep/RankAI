import express from "express";
import authMiddleware from "../middleware/auth.js";
import { analyzeUrl, deleteAnalysis, getAnalyses, getAnalysis } from "../controllers/analysisController.js";
const analysisRouter = express.Router();


analysisRouter.post("/analyze",authMiddleware,analyzeUrl);
analysisRouter.get("/list",authMiddleware,getAnalyses);
analysisRouter.get("/:id",authMiddleware,getAnalysis);
analysisRouter.delete("/:id",authMiddleware,deleteAnalysis);


export default analysisRouter;