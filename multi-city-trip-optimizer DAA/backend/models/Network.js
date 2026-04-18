const mongoose = require('mongoose');

const NetworkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cities: [{ type: String }],
  edges: [
    {
      from: String,
      to: String,
      cost: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Network', NetworkSchema);
