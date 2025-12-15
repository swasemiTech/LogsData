import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import logRoute from "./routes/logRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use("/api", logRoute);

app.get("/", (req, res) => {
  res.send("Rain Logger API Running \n Add Queury Perameters");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
