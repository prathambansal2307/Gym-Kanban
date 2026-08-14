import express from 'express';
import {
  getSubscribers,
  getSubscriberById,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  updateSubscriberStatus,
} from '../controllers/subscriberController.js';

const router = express.Router();

router.get('/', getSubscribers);
router.get('/:id', getSubscriberById);
router.post('/', createSubscriber);
router.put('/:id', updateSubscriber);
router.delete('/:id', deleteSubscriber);
router.patch('/:id/status', updateSubscriberStatus);

export default router;