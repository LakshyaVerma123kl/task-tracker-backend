require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");

const app = express();

connectDB();

app.use(
  cors({
    origin: "https://task-tracker-frontend-navy.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// Add default route
app.get("/", (req, res) => {
  res.send("Task Tracker Backend API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
