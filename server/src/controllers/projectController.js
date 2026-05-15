import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      siteCode,
      description,
      location,
      status,
      priority,
      startDate,
      endDate,
      groupName,
      progress,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      siteCode,
      description,
      location,
      status,
      priority,
      startDate: startDate || null,
      endDate: endDate || null,
      groupName,
      progress: progress ?? 0,
      createdBy: req.user._id,
      attachment: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Server error while creating project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ message: "Server error while fetching project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const fields = [
      "title",
      "siteCode",
      "description",
      "location",
      "status",
      "priority",
      "startDate",
      "endDate",
      "groupName",
      "progress",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    if (req.file) {
      project.attachment = `/uploads/${req.file.filename}`;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: "Server error while updating project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Server error while deleting project" });
  }
};