import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });

    const recentUsers = await User.find()
      .select("username email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Welcome Admin",
      user: req.user,
      stats: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
      },
      recentUsers,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find()
      .select("username email role createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/users/:id/role", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/users/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;