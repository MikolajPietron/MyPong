const serverless = require('serverless-http');
const app = require('../server');

app.get('/api/test', (req, res) => {
  res.json({ message: "API is working!" });
});

module.exports.handler = serverless(app);
