import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://construction-site-tracker-gh7t.vercel.app",
      "https://construction-site-tracker-gh7t-6ly699hfh.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);

export default app;