import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database");
  } catch (error) {
    console.error("❌ Error cconnecting database", error);
    process.exit(1); // stop the app if DB fails
  }
};
