import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ Connected with the database!");
    } catch (error) {
        console.log("❌ Error in connecting with database", error);
        process.exit(1);
    }
};

export default dbConnect;
