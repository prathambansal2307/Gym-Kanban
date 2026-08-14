import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    membershipPlan: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'new',
        'onboarding',
        'active',
        'onhold',
        'expiringsoon',
        'renewaldue',
        'expired',
      ],
      default: 'new',
    },
    trainer: {
      type: String,
      default: '',
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

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;