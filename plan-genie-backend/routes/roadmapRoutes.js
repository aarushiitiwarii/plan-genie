import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Roadmap from "../models/Roadmap.js";

dotenv.config();
const router = express.Router();

// =========================
// 1. AI ROADMAP GENERATION
// =========================
router.post("/generate", async (req, res) => {
  let { goal, experience, timePerWeek, learningStyle, format, numWeeks } = req.body;

  // Default to 6 weeks if not provided or invalid
  if (!numWeeks || isNaN(numWeeks) || parseInt(numWeeks) < 1) {
    numWeeks = 6;
  } else {
    numWeeks = parseInt(numWeeks);
  }

  // Basic validation
  if (!goal || !experience || !timePerWeek || !learningStyle || !format) {
    return res.status(400).json({ error: "All fields except number of weeks are required" });
  }

  // Generate roadmap template format for all weeks
  let weeksSection = "";
  for (let i = 1; i <= numWeeks; i++) {
    weeksSection += `Week ${i}: [Title]\nGoal: [Goal for the week]\nTasks:\n1. ...\n2. ...\n3. ...\n[Add recommended free/paid resources]\n\n`;
  }

  // Final AI prompt using weeksSection
  const prompt = `
You are PlanGenie, an AI learning roadmap assistant.

User's goal: ${goal}
Experience level: ${experience}
Time available per week: ${timePerWeek}
Learning style: ${learningStyle}
Preferred content format: ${format}

Create a detailed ${numWeeks}-week learning roadmap for the user. Make sure to:

- Tailor the number and complexity of tasks each week based on the user's available time:
  - Less than 5 hours → 2–3 light tasks/week
  - 5–10 hours → 4–5 moderate tasks/week
  - 10–15 hours → 5–6 tasks/week (some deep work)
  - 15+ hours → 6–8 intensive tasks/week

- Vary content to match the user’s preferred learning style and format.
- Use this exact format (no introductions or extra text):

${weeksSection}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const roadmap = response.data.choices[0].message.content;
    res.status(200).json({ roadmap });
  } catch (error) {
    console.error("OpenRouter error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

// =============================
// 2. SAVE ROADMAP TO DATABASE
// =============================
router.post("/", async (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: "userId and content are required" });
  }

  try {
    const saved = await Roadmap.create({ userId, content });
    console.log("✅ Roadmap saved to DB:", saved._id);
    res.status(201).json({ message: "Roadmap saved", id: saved._id });
  } catch (error) {
    console.error("❌ Error saving roadmap:", error.message);
    res.status(500).json({ error: "Failed to save roadmap" });
  }
});

// ======================================
// 3. GET ALL ROADMAPS FOR A USER (NEW)
// ======================================
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const plans = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error("❌ Failed to fetch roadmaps:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
