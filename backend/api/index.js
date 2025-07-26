const serverless = require('serverless-http');
const express = require('express');

const app = express();

app.get('/api/getgamescore', (req, res) => {
  res.json([{ playerName: "Test", score: 100, date: new Date() }]);
});

module.exports.handler = serverless(app);
