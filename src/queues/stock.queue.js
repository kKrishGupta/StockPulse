import Queue from "bull";
import {ENV} from "../config/env.js";

// Redis Connection
const redisConfig = {
  host :"127.0.0.1",
  port: 6379,
};
// Create queue
export const stockQueue = new Queue("stock-queue",{
  redis : redisConfig
});
