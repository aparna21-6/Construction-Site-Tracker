import dns from "node:dns";
import dotenv from "dotenv";
dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import path from "path";
import express from "express";
import app from "./app.js";
import connectDB from "./config/db.js";

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();