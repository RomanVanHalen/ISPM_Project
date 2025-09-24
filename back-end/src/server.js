import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import policiesRouter from "./routes/policies.js"; // ✅ Added policies router
import progressRoutes from "./routes/progressRoutes.js"; // Added progress route
import NotificationRoute from "./routes/NotificationRoute.js"; // Added notification route
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the express app
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

// ✅ Serve static files from uploads directory
// Example: http://localhost:5000/uploads/filename.jpg
// Serve PDFs from the correct folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/progress", progressRoutes);  // Added progress route
app.use("/api/notifications", NotificationRoute); // added notification route

// ✅ Policies JSON route
app.use("/api/policies", policiesRouter);

// Health check
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  

