import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import logRoute from "./routes/logRoute.js";
import fs from 'fs';
import https from 'https'


dotenv.config();
connectDB();

const app = express();

// CORS middleware - Allow all origins for SIMCOM module compatibility
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Query params:", req.query);
  console.log("Headers:", req.headers);
  next();
});

app.use("/api", logRoute);

app.get("/", (req, res) => {
  res.send("Rain Logger API Running");
});

const options = {
  key: fs.readFileSync('../localhost-key.pem'),
  cert: fs.readFileSync('../localhost.pem'),
};


https.createServer(options, app).listen(5050, () => {
  console.log("https server running at https://localhost:5050")
})