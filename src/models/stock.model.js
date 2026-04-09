import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
    },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    change: Number,
    percentChange: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate entries
stockSchema.index({ symbol: 1, timestamp: 1 }, { unique: true });

export const Stock = mongoose.model("Stock", stockSchema);