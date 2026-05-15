import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(upload.single("attachment"), createProject);

router
  .route("/:id")
  .get(getProjectById)
  .put(upload.single("attachment"), updateProject)
  .delete(deleteProject);

export default router;