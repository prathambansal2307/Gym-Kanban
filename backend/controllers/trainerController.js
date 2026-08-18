import Trainer from '../models/Trainer.js';

// @desc    Get all trainers
// @route   GET /api/trainers
export const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new trainer
// @route   POST /api/trainers
export const createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a trainer
// @route   PUT /api/trainers/:id
export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.status(200).json(trainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a trainer
// @route   DELETE /api/trainers/:id
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};