import express from "express";
import dotenv from "dotenv";
import cors from "cors";   // 👈 import cors
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



dotenv.config();

// Create the express app
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// 👇 Enable CORS so frontend (React at localhost:3000) can access backend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
