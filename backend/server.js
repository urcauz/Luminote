import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins since frontend and backend are on the same domain
    methods: ["GET", "POST"]
  }
});

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes (Backend API)
app.use('/api/notes', noteRoutes); // Adjust as needed

// Serve the frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Socket.io
io.on('connection', socket => {
  console.log('Client connected');
  socket.on('note', data => {
    socket.broadcast.emit('note', data); // broadcast to others
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 10000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
