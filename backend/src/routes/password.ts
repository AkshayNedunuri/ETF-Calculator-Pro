import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import clientPromise from "../config/database";

const router = Router();

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiry = new Date(Date.now() + 3600000);

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetToken: hashedToken,
          resetTokenExpiry: expiry
        }
      }
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    console.log(`[AUTH] Password reset link for ${email}: ${resetUrl}`);

    return res.status(200).json({
      message: "Reset link generated successfully (Simulated Email)",
      debugUrl: resetUrl
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message
    });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and new password are required"
      });
    }

    const client = await clientPromise;
    const db = client.db();

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await db.collection("users").findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Token is invalid or has expired."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }
      }
    );

    return res.status(200).json({
      message: "Password updated successfully! You can now log in."
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message
    });
  }
});

export default router;
