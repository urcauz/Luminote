import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

// Clerk, routes, etc. — import your files here:
import noteRoutes from './routes/noteRoutes.js'; // Adjust as needed

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "*", credentials: true }));
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes); // Or whatever routes you defined

// Serve frontend build (React)
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
