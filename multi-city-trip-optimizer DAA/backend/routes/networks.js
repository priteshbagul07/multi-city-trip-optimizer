const express = require('express');
const router = express.Router();
const Network = require('../models/Network');

// GET all saved networks
router.get('/', async (req, res) => {
  try {
    const networks = await Network.find().sort({ createdAt: -1 });
    res.json(networks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single network by ID
router.get('/:id', async (req, res) => {
  try {
    const network = await Network.findById(req.params.id);
    if (!network) return res.status(404).json({ error: 'Network not found' });
    res.json(network);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new network
router.post('/', async (req, res) => {
  try {
    const { name, cities, edges } = req.body;
    if (!name || !cities || !edges) {
      return res.status(400).json({ error: 'name, cities, and edges are required' });
    }
    const network = new Network({ name, cities, edges });
    await network.save();
    res.status(201).json(network);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE network
router.delete('/:id', async (req, res) => {
  try {
    await Network.findByIdAndDelete(req.params.id);
    res.json({ message: 'Network deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
