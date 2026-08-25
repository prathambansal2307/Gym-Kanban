import express from 'express';
import {
  getSubscribers,
  getSubscriberById,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  updateSubscriberStatus,
} from '../controllers/subscriberController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSubscribers);
router.get('/:id', protect, getSubscriberById);
router.post('/', protect, createSubscriber);
router.put('/:id', protect, updateSubscriber);
router.delete('/:id', protect, deleteSubscriber);
router.patch('/:id/status', protect, updateSubscriberStatus);

export default router;