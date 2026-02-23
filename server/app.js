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

console.log('__dirname:', __dirname);
console.log('process.cwd():', process.cwd());
console.log('Files in __dirname:', fs.readdirSync(__dirname));

const clientPath = path.join(__dirname, 'dist');
console.log('Looking for dist at:', clientPath);
console.log('dist exists:', fs.existsSync(clientPath));

if (fs.existsSync(clientPath)) {
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

module.exports = app;
