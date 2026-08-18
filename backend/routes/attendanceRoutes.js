import express from 'express';
import {
  getAttendance,
  bulkCreateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/', getAttendance);
router.post('/bulk', bulkCreateAttendance);
router.delete('/:id', deleteAttendance);

export default router;