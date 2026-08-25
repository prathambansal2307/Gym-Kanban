import express from 'express';
import {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from '../controllers/trainerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTrainers);
router.post('/', protect, createTrainer);
router.put('/:id', protect, updateTrainer);
router.delete('/:id', protect, deleteTrainer);

export default router;