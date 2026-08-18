import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import planRoutes from './routes/planRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('Gym Kanban API is running...');
});

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});