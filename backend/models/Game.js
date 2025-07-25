const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    playerName : String,
    score : Number,
    totalHits : Number,
    date : {type : Date, default : Date.now}
});
module.exports = mongoose.model('Game', gameSchema);