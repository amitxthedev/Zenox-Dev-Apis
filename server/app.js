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

const distPath = path.join(__dirname, '..', 'dist');
const staticPath = path.join(__dirname, 'dist');

let servePath = null;

if (fs.existsSync(staticPath)) {
  servePath = staticPath;
} else if (fs.existsSync(distPath)) {
  servePath = distPath;
}

if (servePath) {
  console.log('Serving static files from:', servePath);
  app.use(express.static(servePath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(servePath, 'index.html'));
  });
}

module.exports = app;
