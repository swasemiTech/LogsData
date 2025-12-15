import mongoose from "mongoose";

const rainLogSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  rainFall: {
    type: Number,
    required: true
  },
  Volt: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("RainLog", rainLogSchema);
