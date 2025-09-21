import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../policies.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read JSON" });
    try {
      const policies = JSON.parse(data);
      res.json(policies);
    } catch (parseErr) {
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

export default router;

