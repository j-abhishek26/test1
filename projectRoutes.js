const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    res.json(await Project.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
});

// GET one project
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid project ID" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve project" });
  }
});

// CREATE project
router.post("/", async (req, res) => {
  try {
    const { name, description = "", status = "Pending" } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ error: "Project name is required" });

    const project = await Project.create({ name, description, status });
    res.status(201).json(project);
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Failed to create project" });
  }
});

// UPDATE project
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid project ID" });

    const project = await Project.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: "Failed to update project" });
  }
});

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid project ID" });

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
