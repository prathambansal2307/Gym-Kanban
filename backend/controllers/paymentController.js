import Payment from '../models/Payment.js';

// @desc    Get all payments (with subscriber details populated)
// @route   GET /api/payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('subscriber', 'name email')
      .sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new payment
// @route   POST /api/payments
export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    const populatedPayment = await payment.populate('subscriber', 'name email');
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};