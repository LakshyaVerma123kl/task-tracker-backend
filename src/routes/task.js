const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");

// Get tasks by project
router.get("/project/:projectId", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    console.log("GET /project: Project:", project); // Debug log
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    console.log(
      "GET /project: Project user:",
      project.user.toString(),
      "Req user:",
      req.user.id
    );
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const tasks = await Task.find({ project: req.params.projectId });
    console.log("GET /project: Tasks fetched:", tasks); // Debug log
    res.json(tasks);
  } catch (err) {
    console.error("Error in GET /api/tasks/project/:projectId:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, status, projectId } = req.body;
  console.log("POST /tasks: Request body:", req.body);
  try {
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title and projectId are required" });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    console.log(
      "POST /tasks: Project user:",
      project.user.toString(),
      "Req user:",
      req.user.id
    );
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const task = new Task({
      title,
      description: description || "",
      status: status || "Not Started",
      project: projectId,
      user: req.user.id,
      createdAt: new Date(),
      completedAt: status === "Completed" ? new Date() : null,
    });
    await task.save();
    console.log("POST /tasks: Task saved:", task);
    project.tasks.push(task._id);
    await project.save();
    console.log("POST /tasks: Updated project:", project);
    res.status(201).json(task);
  } catch (err) {
    console.error("Error in POST /api/tasks:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  console.log("PUT /tasks: Request body:", req.body);
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    console.log(
      "PUT /tasks: Task user:",
      task.user.toString(),
      "Req user:",
      req.user.id
    );
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    task.completedAt = status === "Completed" ? new Date() : null;
    await task.save();
    console.log("PUT /tasks: Task updated:", task);
    res.json(task);
  } catch (err) {
    console.error("Error in PUT /api/tasks/:id:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    console.log(
      "DELETE /tasks: Task user:",
      task.user.toString(),
      "Req user:",
      req.user.id
    );
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id },
    });
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error in DELETE /api/tasks/:id:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
