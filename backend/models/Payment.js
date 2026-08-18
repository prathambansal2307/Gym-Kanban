import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscriber',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    membershipPlan: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer'],
      default: 'upi',
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

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;