import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateUploadUrl, generateDownloadUrl } from "./s3Route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7777;

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());

app.post("/get-upload-url", async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ error: "filename is required" });
    }

    
    const contentType = "image/jpeg";
    const result = await generateUploadUrl(filename, contentType);

    res.json({
      uploadUrl: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

app.post("/get-download-url", async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }

    const downloadUrl = await generateDownloadUrl(key);
    res.json({ downloadUrl });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
