import express from "express";
import Note from "../models/Note.js";
import { clerkAuthMiddleware } from "../middleware/authMiddleware.js";
import { OpenAI } from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

router.use(clerkAuthMiddleware);

router.post("/", async (req, res) => {
  const { content } = req.body;
  try {
    const summaryRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Summarize: ${content}` }]
    });

    const summary = summaryRes.choices[0].message.content;
    const note = await Note.create({ content, summary, owner: req.userId });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to save note" });
  }
});

router.get("/", async (req, res) => {
  const notes = await Note.find({ owner: req.userId });
  res.json(notes);
});

export default router;
