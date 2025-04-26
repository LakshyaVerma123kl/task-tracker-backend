const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Project = require("../models/Project");
const Task = require("../models/Task");

// Get all projects for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Request user ID:", req.user.id); // Debug log
    if (!req.user.id || typeof req.user.id !== "string") {
      throw new Error("Invalid user ID from token");
    }
    const projects = await Project.find({ user: req.user.id });
    console.log("Found projects:", projects); // Debug log
    res.json(projects);
  } catch (err) {
    console.error("Error in GET /api/projects:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a new project
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const project = new Project({
      title,
      description: description || "",
      user: req.user.id,
      tasks: [],
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Error in POST /api/projects:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a project
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    await project.save();
    res.json(project);
  } catch (err) {
    console.error("Error in PUT /api/projects/:id:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Task.deleteMany({ project: project._id });
    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error in DELETE /api/projects/:id:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
