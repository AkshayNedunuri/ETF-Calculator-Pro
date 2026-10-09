import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "../config/database";
import { User, JWTPayload } from "../types";

const router = Router();

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const client = await clientPromise;
    const db = client.db();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists in the database. Please log in."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.collection("users").insertOne({
      name: (name || "").trim() || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "An error occurred during signup",
      error: error.message
    });
  }
});

// Sign in (credentials)
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const client = await clientPromise;
    const db = client.db();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.collection("users").findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET || "wealthcalc-super-secret-key-change-me";
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image
      }
    });
  } catch (error: any) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "An error occurred during signin",
      error: error.message
    });
  }
});

// Google OAuth (placeholder - requires full OAuth flow implementation)
router.post("/google", async (req, res) => {
  try {
    // This endpoint would handle Google OAuth token exchange
    // For now, returning a placeholder response
    return res.status(501).json({
      message: "Google OAuth implementation required. Use frontend NextAuth for now."
    });
  } catch (error: any) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      message: "An error occurred during Google authentication",
      error: error.message
    });
  }
});

export default router;
