import express from 'express';
import cors from 'cors';
import stockRoutes from './routes/stock.routes.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/stocks', stockRoutes);

export default app;