const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Project = require("../models/Project");
const Task = require("../models/Task");

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Get all projects for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.userId }).populate(
      "tasks"
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new project
router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const project = new Project({
      title,
      description,
      user: req.user.userId,
      tasks: [],
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Delete a project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    await Project.deleteOne({ _id: req.params.id });
    await Task.deleteMany({ project: req.params.id }); // Clean up associated tasks
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

module.exports = router;
