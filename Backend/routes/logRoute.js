import express from "express";
import RainLog from "../models/RainLog.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();


router.get("/log", async (req, res) => {
  try {
    const { id, Date, Time, Rain, Temp } = req.query;

    if (!id || !Date || !Time || !Rain || !Temp) {
      return res.status(400).json({ status: "ERROR", message: "Missing parameters" });
    }

    await RainLog.create({
      id: uuidv4(),
      date: Date,
      time: Time,
      rainFall: Number(Rain),
      temperature: Number(Temp)
    });

    return res.json({ status: "OK" });

  } catch (err) {
    return res.status(500).json({ status: "ERROR", message: err.message });
  }
});

export default router;
