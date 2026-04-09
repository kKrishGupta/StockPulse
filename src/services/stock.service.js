import axios from 'axios';
import { ENV } from '../config/env.js';
import { Stock } from '../models/stock.model.js';

export const fetchStockData = async (symbol) => {
  try{
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${ENV.FINNHUB_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;
    if(!data || !data.c){
      throw new Error('Invalid data from API');
    }
    const open = data.o;
    const high = data.h;
    const low = data.l;
    const close = data.c;
    const volume = data.v || 0; // Finnhub doesn't provide volume in quote endpoint
    const change = close - open;
    const percentChange = open !== 0 ? (change / open) * 100 : 0;
    
    return {
      symbol,
      open,
      high,
      low,
      close,
      volume,
      change,
      percentChange,
      timestamp: new Date(data.t * 1000) // Convert UNIX timestamp to JS Date
    };
  }
  catch(error){
    console.error(`❌ Error fetching stock data for ${symbol}:`, error.message);
    throw error;
  }
};

export const saveStockData = async (data) => {
  try{
     const stock = await Stock.create(data);
     return stock;
  }
  catch(error){
        // Ignore duplicate errors
    if (error.code === 11000) return null;
    console.error(`❌ Error saving stock data for ${data.symbol}:`, error.message);
    throw error;
  }
}