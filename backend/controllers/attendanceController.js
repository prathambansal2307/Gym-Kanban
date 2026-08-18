import Attendance from '../models/Attendance.js';

function normalizeDate(dateString) {
  return new Date(dateString);
}

// @desc    Get attendance, optionally filtered by date + session
// @route   GET /api/attendance?date=YYYY-MM-DD&session=morning
export const getAttendance = async (req, res) => {
  try {
    const filter = {};

    if (req.query.date && req.query.session) {
      filter.checkInDate = normalizeDate(req.query.date);
      filter.session = req.query.session;
    }

    const records = await Attendance.find(filter)
      .populate('subscriber', 'name email')
      .sort({ checkInDate: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance for multiple subscribers at once
// @route   POST /api/attendance/bulk
export const bulkCreateAttendance = async (req, res) => {
  try {
    const { date, session, subscriberIds } = req.body;

    if (!date || !session || !Array.isArray(subscriberIds)) {
      return res
        .status(400)
        .json({ message: 'date, session, and subscriberIds are required.' });
    }

    const checkInDate = normalizeDate(date);
    const created = [];
    const skipped = [];

    for (const subscriberId of subscriberIds) {
      try {
        const record = await Attendance.create({
          subscriber: subscriberId,
          checkInDate,
          session,
        });
        const populated = await record.populate('subscriber', 'name email');
        created.push(populated);
      } catch (error) {
        if (error.code === 11000) {
          skipped.push(subscriberId);
        } else {
          throw error;
        }
      }
    }

    res.status(201).json({ created, skipped });
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