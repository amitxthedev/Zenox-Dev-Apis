const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const possiblePaths = [
  path.join(__dirname, 'dist'),
  path.join(__dirname, '../client/dist'),
  path.join(__dirname, '../dist'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), '../dist'),
  path.join(process.cwd(), '../client/dist'),
];

let clientPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    clientPath = p;
    console.log('Found static files at:', clientPath);
    break;
  }
}

if (clientPath) {
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

module.exports = app;
