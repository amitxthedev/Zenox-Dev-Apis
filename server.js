require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const app = require('./app');
const { initDatabase } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
