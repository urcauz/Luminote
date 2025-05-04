import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: String,
  summary: String,
  owner: String
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);
