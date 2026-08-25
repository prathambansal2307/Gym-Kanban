import express from 'express';
import {
  getAttendance,
  bulkCreateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/', protect, getAttendance);
router.post('/bulk', protect, bulkCreateAttendance);
router.delete('/:id', protect, deleteAttendance);

export default router;