import express from 'express';
import { getStockData } from '../controllers/stock.controller.js';

const router = express.Router();
router.get('/:symbol', getStockData);

export default router;