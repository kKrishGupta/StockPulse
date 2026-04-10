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

    // 🔍 Debug (important)
    console.log("Finnhub response:", data);

    // ⚠️ Handle invalid / empty response gracefully
    if (!data || data.t === 0) {
      return {
        symbol,
        error: "No live data available (market closed or invalid symbol)",
      };
    }

    const open = data.o || 0;
    const high = data.h || 0;
    const low = data.l || 0;
    const close = data.c || 0;
    const prevClose = data.pc || 0;

    const change = close - prevClose;
    const percentChange =
      prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return {
      symbol,
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume: null,
      change: round(change),
      percentChange: round(percentChange),
      status:
        change > 0 ? "UP" : change < 0 ? "DOWN" : "STABLE",
      timestamp: new Date(data.t * 1000),
    };
  } catch (error) {
    console.error(
      `❌ Error fetching stock data for ${symbol}:`,
      error.message
    );

    // ✅ Do NOT crash system — return safe response
    return {
      symbol,
      error: "Failed to fetch stock data",
    };
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

export const fetchStockHistory = async (symbol) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 24 * 60 * 60;

    const url = `https://finnhub.io/api/v1/stock/candle`;

    const response = await axios.get(url, {
      params: {
        symbol,
        resolution: "5",
        from: oneDayAgo,
        to: now,
        token: ENV.FINNHUB_API_KEY,
      },
    });

    const data = response.data;

    // 🔍 Debug (very helpful)
    console.log("History API response:", data);

    // ⚠️ Handle no data case
    if (!data || data.s !== "ok" || !data.t) {
      return []; // return empty instead of crashing
    }

    return data.t.map((time, i) => ({
      timestamp: new Date(time * 1000),
      open: data.o[i] || 0,
      high: data.h[i] || 0,
      low: data.l[i] || 0,
      close: data.c[i] || 0,
      volume: data.v[i] || 0,
    }));
  } catch (error) {
    console.error(
      `❌ Error fetching stock history for ${symbol}:`,
      error.message
    );

    // ✅ return safe fallback instead of throwing
    return [];
  }
};

export const getTopGainers = async (limit = 5) => {
  return await Stock.find({})
    .sort({ percentChange: -1 })
    .limit(limit);
};

export const getTopLosers = async (limit = 5) => {
  return await Stock.find({})
    .sort({ percentChange: 1 })
    .limit(limit);
};

export const getStocks = async ({ page = 1, limit = 10, symbol }) => {
  const query = symbol ? {symbol} : {};
  const skip = (page - 1) *limit;
  const data = await Stock.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);
  const total = await Stock.countDocuments(query);
  return { data, total,page,limit };
}