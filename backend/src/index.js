// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({
  path: envPath,
});

// Now import other modules that may depend on env vars
import { createServer } from 'http';
import connectDB from './db/index_db.js';
import { app } from './app.js';

// Create HTTP server (required for potential WebSocket/streaming features)
const server = createServer(app);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`✅ Server is running on port: ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed!', err);
    process.exit(1);
  });
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

