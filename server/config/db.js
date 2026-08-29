import mongoose from "mongoose";
import dns from "dns";

// Use custom DNS servers if available
const dnsServers = process.env.DNS_SERVERS?.split(",") || ["8.8.8.8", "8.8.4.4"];
dns.setServers(dnsServers);

const connectDb = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
        });
        
        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error.message);
        });
        
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw error; // Propagate error so server startup can fail gracefully
    }
}

export default connectDb;