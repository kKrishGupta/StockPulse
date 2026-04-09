import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT : process.env.PORT || 5000,
  MONGO_URI : process.env.MONGO_URI,
  FINNHUB_API_KEY : process.env.FINNHUB_API_KEY
};