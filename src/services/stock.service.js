import axios from "axios";
import { ENV } from "../config/env.js";
import { Stock } from "../models/stock.model.js";

// Utility: round numbers
const round = (num) => Number(num.toFixed(2));

export const fetchStockData = async (symbol) => {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${ENV.FINNHUB_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data || data.c === 0 || data.t === 0) {
      throw new Error("Invalid stock data from Finnhub");
    }

    const open = data.o;
    const high = data.h;
    const low = data.l;
    const close = data.c;
    const prevClose = data.pc;

    // ✅ Correct calculation
    const change = close - prevClose;
    const percentChange = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return {
      symbol,
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume: null, // Finnhub quote API doesn't provide volume
      change: round(change),
      percentChange: round(percentChange),
      status: change > 0 ? "UP" : "DOWN",
      timestamp: new Date(data.t * 1000),
    };
  } catch (error) {
    console.error(`❌ Error fetching stock data for ${symbol}:`, error.message);
    throw error;
  }
};

export const saveStockData = async (data) => {
  try {
    const stock = await Stock.create(data);
    return stock;
  } catch (error) {
    if (error.code === 11000) return null;

    console.error(
      `❌ Error saving stock data for ${data.symbol}:`,
      error.message
    );
    throw error;
  }
};