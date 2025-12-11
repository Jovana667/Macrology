import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import foodRoutes from './routes/foodRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/foods', foodRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'food-service' });
});

app.listen(PORT, () => {
  console.log(`Food service running on port ${PORT}`);
});

export default app;