import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;