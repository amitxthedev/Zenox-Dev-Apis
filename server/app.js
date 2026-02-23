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

const distPath = path.join(__dirname, 'dist');
const altDistPath = path.join(__dirname, '../server/dist');

let clientPath = distPath;
if (!fs.existsSync(distPath) && fs.existsSync(altDistPath)) {
  clientPath = altDistPath;
}

if (fs.existsSync(clientPath)) {
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

module.exports = app;
