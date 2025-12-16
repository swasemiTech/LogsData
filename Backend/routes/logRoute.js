import express from "express";
import RainLog from "../models/RainLog.js";

const router = express.Router();
/**
 * GET /api/WebDataStrings
 * Example:
 * /api/WebDataStrings?id=<-Anything>&Data=s1_18/06/2025,s2_13:58:22,s16_2.8,s25_12.97;
 */

// Delete ALL documents (keep collection)
// export const deleteAllLogs = async () => {
//   return await RainLog.deleteMany({});
// };
// deleteAllLogs();
// Health check endpoint for testing connectivity
router.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

router.get("/WebDataStrings", async (req, res) => {
  try {
    console.log("=== WebDataStrings Request ===");
    console.log("Full URL:", req.originalUrl);
    console.log("Query params:", req.query);
    
    const { id, Data } = req.query;

    if (!id || !Data) {
      console.log("❌ Missing parameters - id:", id, "Data:", Data);
      return res.status(400).json({
        status: "ERROR",
        message: "Missing id or Data parameter"
      });
    }

    // Remove trailing semicolon
    const cleanData = Data.replace(/;$/, "");

    // Parse key-value pairs
    const parsed = {};
    cleanData.split(",").forEach(item => {
      const [key, value] = item.split("_");
      if (key && value) {
        parsed[key] = value;
      }
    });

    console.log("Parsed data:", parsed);

    // Mapping according to your format
    const date = parsed["s1"];
    const time = parsed["s2"];
    const rainFall = parsed["s16"];
    const volt = parsed["s25"];

    if (!date || !time || !rainFall || !volt) {
      console.log("❌ Invalid data format - Missing fields");
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid Data format"
      });
    }

    const logEntry = await RainLog.create({
      id: id,
      date: date,
      time: time,
      rainFall: Number(rainFall),
      Volt: Number(volt)
    });

    console.log("✅ Data saved successfully:", logEntry._id);
    return res.json({ status: "OK", message: "Data saved successfully" });

  } catch (err) {
    console.error("❌ Error in WebDataStrings:", err);
    return res.status(500).json({
      status: "ERROR",
      message: err.message
    });
  }
});

export default router;
