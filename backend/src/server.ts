import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import passwordRoutes from "./routes/password";
import calculationsRoutes from "./routes/calculations";
import healthRoutes from "./routes/health";

dotenv.config();

process.on("unhandledRejection", (reason: any) => {
  console.warn("⚠️ Unhandled Rejection:", reason?.message || reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", passwordRoutes);
app.use("/api/calculations", calculationsRoutes);
app.use("/api/health", healthRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "WealthCalc India Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/signup, /api/auth/signin, /api/auth/google",
      password: "/api/forgot-password, /api/reset-password",
      calculations: "/api/calculations",
      health: "/api/health"
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📊 API Base: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});
