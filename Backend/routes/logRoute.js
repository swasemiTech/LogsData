import express from "express";
import RainLog from "../models/RainLog.js";

const router = express.Router();

/**
 * GET /api/WebDataStrings
 * Example:
 * /api/WebDataStrings?id=RAIN_TEST&Data=s1_18/06/2025,s2_13:58:22,s16_2.8,s25_12.97;
 */
router.get("/WebDataStrings", async (req, res) => {
  try {
    const { id, Data } = req.query;

    if (!id || !Data) {
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
      parsed[key] = value;
    });

    // Mapping according to your format
    const date = parsed["s1"];
    const time = parsed["s2"];
    const rainFall = parsed["s16"];
    const volt = parsed["s25"];

    if (!date || !time || !rainFall || !volt) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid Data format"
      });
    }

    await RainLog.create({
      id: id,
      date: date,
      time: time,
      rainFall: Number(rainFall),
      Volt: Number(volt)
    });

    return res.json({ status: "OK" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "ERROR",
      message: err.message
    });
  }
});

export default router;
