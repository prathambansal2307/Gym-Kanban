import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import subscriberRoutes from './routes/subscriberRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/subscribers', subscriberRoutes);

app.get('/', (req, res) => {
  res.send('Gym Kanban API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});