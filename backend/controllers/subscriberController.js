import Subscriber from '../models/Subscriber.js';

//Get all subscribers
//GET /api/subscribers
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get a single subscriber by ID
//GET /api/subscribers/:id
export const getSubscriberById = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.status(200).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new subscriber
// POST /api/subscribers
export const createSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.create(req.body);
    res.status(201).json(subscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Update an existing subscriber
//PUT /api/subscribers/:id
export const updateSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.status(200).json(subscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a subscriber
// DELETE /api/subscribers/:id
export const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update only the status of a subscriber (used for Kanban drag-and-drop)
//PATCH /api/subscribers/:id/status
export const updateSubscriberStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.status(200).json(subscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};