const express = require("express");
const cors = require("cors");
const RunwayML = require("@runwayml/sdk");

const app = express();

app.use(cors());
app.use(express.json());

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt, duration = 5, ratio = "1280:720" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const task = await client.imageToVideo.create({
      model: "gen4.5",
      promptText: prompt,
      ratio,
      duration: Number(duration)
    }).waitForTaskOutput();

    res.json({
      videoUrl: task.output?.[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Video generation failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
