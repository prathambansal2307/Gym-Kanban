import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    gymName: {
      type: String,
      default: 'My Gym',
    },
    address: {
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
    expiringSoonThresholdDays: {
      type: Number,
      default: 7,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;