require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Not connected"
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("Set MONGO_URI and JWT_SECRET in backend/.env");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully");
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API running at http://localhost:${port}`));
}
start().catch((err) => {
  console.error("Startup failed:", err.message);
  process.exit(1);
});
