import express from 'express';
import { getAllStocks, getStockData, getStockHistory , getTopGainers,getTopLosers} from '../controllers/stock.controller.js';

const router = express.Router();
router.get('/:symbol', getStockData);
router.get('/history/:symbol', getStockHistory);
router.get('cd', getTopGainers);
router.get('/top-losers', getTopLosers);
router.get('/', getAllStocks);

export default router;