import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProgressRoutes from "./routes/adminProgressRoutes.js"; // ✅ Make sure filename matches exactly
import progressRoutes from "./routes/progressRoutes.js";
import policiesRouter from "./routes/policies.js";
import NotificationRoute from "./routes/NotificationRoute.js";
import scoreRoute from "./routes/scoreRoutes.js";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Mount admin progress route on a **sub-path**
app.use("/api/admin/progress", adminProgressRoutes);

// Other routes
app.use("/api/progress", progressRoutes);
app.use("/api/notifications", NotificationRoute);
app.use("/api/score", scoreRoute);
app.use("/api/policies", policiesRouter);
app.use("/api/policy-views", PolicyViewsRouter); // ✅ add this


// Health check
app.get("/", (req, res) => res.send("✅ API is running..."));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
