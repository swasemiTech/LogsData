import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Swasemi:YfJgkGrtHhTBexnO@cluster0.iwnypay.mongodb.net/rain_logger?retryWrites=true&w=majority");
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
