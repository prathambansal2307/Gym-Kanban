import Attendance from '../models/Attendance.js';

// @desc    Get all attendance records (with subscriber details populated)
// @route   GET /api/attendance
export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('subscriber', 'name email')
      .sort({ checkInDate: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new attendance record (check-in)
// @route   POST /api/attendance
export const createAttendance = async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    const populatedRecord = await record.populate('subscriber', 'name email');
    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
export const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};