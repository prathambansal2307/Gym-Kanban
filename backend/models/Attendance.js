import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscriber',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    session: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index(
  { subscriber: 1, checkInDate: 1, session: 1 },
  { unique: true }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;