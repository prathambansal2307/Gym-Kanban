import express from 'express';
import {
  getPayments,
  createPayment,
  deletePayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/', protect, getPayments);
router.post('/', protect, createPayment);
router.delete('/:id', protect, deletePayment);

export default router;