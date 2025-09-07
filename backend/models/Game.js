const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  totalHits: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  difficulty: { type: String, required: true } 
});

module.exports = mongoose.model('Game', gameSchema);
