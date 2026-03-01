import fs from "fs";
import * as pdfParse from "pdf-parse";
import Note from "../models/Note.js";
import { generateEmbedding } from "../services/openaiService.js";
import { chunkText } from "../utils/chunkText.js";

export const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
   const pdfData = await pdfParse.default(dataBuffer);

    const chunks = chunkText(pdfData.text);

    const embeddedChunks = [];

    for (const chunk of chunks) {
      if (chunk.trim().length === 0) continue;

      const embedding = await generateEmbedding(chunk);

      embeddedChunks.push({
        text: chunk,
        embedding
      });
    }

    const note = await Note.create({
      userId: req.user,
      title: req.file.originalname,
      chunks: embeddedChunks
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: "PDF processed and stored successfully",
      noteId: note._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing PDF" });
  }
};