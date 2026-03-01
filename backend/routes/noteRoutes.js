import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadNote } from "../controllers/noteController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadNote);

export default router;