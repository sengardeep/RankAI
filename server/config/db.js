import mongoose from "mongoose";
import dns from "dns";

// Use custom DNS servers if available
const dnsServers = process.env.DNS_SERVERS?.split(",") || ["8.8.8.8", "8.8.4.4"];
dns.setServers(dnsServers);

const connectDb=async()=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("MongoDB connected");
        });
        
        await mongoose.connect(process.env.MONGODB_URI)
    } 
    catch(error) {
        console.log("Error connecting to MongoDB:",error.message);
    }
}

export default connectDb;