const express = require('express');
const  mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Game = require('./models/Game');

const app = express();
// const PORT =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("Połączono z bazą"))
.catch((err) => console.error("Nie udało się", err));



app.post('/api/gamescore', async (req, res) =>{
    const {playerName, score, totalHits,date} = req.body;

    try{
        const game = new Game ({playerName, score, totalHits, date});   
        await game.save();
        res.status(201).json({message : "Game Saved"});
    }catch (err){
        console.error(err);
        res.status(500).json({message : "Failed to Save The Game"});
    }
});

app.get('/api/getgamescore' , async (req, res) =>{
    try{
        const scores = await Game.find().sort({score : -1});
        res.json(scores);
    }catch(err){
        console.error(err);
        res.status(500).json({message : "Nie udalo sie porac danych"});
    }
});

const PORT = process.env.PORT || 5000; // Use Render's PORT or fallback to 5000 for local testing
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`); // This message will now show in Render logs!
});



// module.exports = app;




// app.listen(PORT, () =>{
//     console.log(`🚀 Server listening on http://localhost:${PORT}`);
// });