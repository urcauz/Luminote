import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import notesRoutes from "./routes/notes.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() =>
  console.log("MongoDB connected")
);

app.use("/api/notes", notesRoutes);

io.on("connection", (socket) => {
  socket.on("noteUpdate", (data) => {
    socket.broadcast.emit("noteUpdate", data);
  });
});

const PORT = 5000;
httpServer.listen(PORT, () => console.log(`Server running on ${PORT}`));
