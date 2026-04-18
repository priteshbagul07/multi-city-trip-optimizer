const express = require('express');
const router = express.Router();
const { floydWarshall } = require('../algorithms/floydWarshall');
const Network = require('../models/Network');

// POST /api/solve - solve with given cities & edges
router.post('/', async (req, res) => {
  try {
    const { cities, edges } = req.body;
    if (!cities || !edges || cities.length < 2) {
      return res.status(400).json({ error: 'At least 2 cities and edges required' });
    }
    const result = floydWarshall(cities, edges);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/solve/:id - solve a saved network by ID
router.post('/:id', async (req, res) => {
  try {
    const network = await Network.findById(req.params.id);
    if (!network) return res.status(404).json({ error: 'Network not found' });
    const result = floydWarshall(network.cities, network.edges);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
