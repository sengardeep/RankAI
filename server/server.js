import express from "express"; 
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import rankRouter from "./routes/rankRoute.js";
import analysisRouter from "./routes/analysisRoutes.js";
import { startRankTrackingCron } from "./cron/rankTrackingCron.js";
const app=express();

// Initialize middleware before connecting to DB
app.use(cors());
app.use(express.json());

const PORT=process.env.PORT || 5000;
app.get("/",(req,res)=>{
    res.send("Server is running");
});

app.use("/api/auth",authRouter);
app.use("/api/rank",rankRouter);
app.use("/api/analysis",analysisRouter)

// Start server and connect to database
const startServer = async () => {
    try {
        // Wait for database connection before starting server
        await connectDb();
        
        // Start cron job after successful DB connection
        startRankTrackingCron();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();