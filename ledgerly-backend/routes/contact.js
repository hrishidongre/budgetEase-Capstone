
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: "All fields required" });
  }

  try {
    const saved = await prisma.contactMessage.create({
      data: { name, email, message },
    });

    return res.json({ success: true, data: saved });
  } catch (err) {
    console.error("Error saving contact message:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
