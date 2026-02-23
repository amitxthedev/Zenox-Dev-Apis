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
console.log('Files in __dirname:', fs.readdirSync(__dirname));

const possiblePaths = [
  path.join(__dirname, 'dist'),
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', '..', 'dist'),
  path.join(process.cwd(), 'dist'),
];

for (const p of possiblePaths) {
  console.log('Checking:', p, 'exists:', fs.existsSync(p));
}

let servePath = possiblePaths.find(p => fs.existsSync(p));

if (servePath) {
  console.log('Static from:', servePath);
  app.use(express.static(servePath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(servePath, 'index.html'));
  });
}

module.exports = app;
