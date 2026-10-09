import { Router } from "express";
import { ObjectId } from "mongodb";
import clientPromise from "../config/database";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all calculations for user
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db();

    const calculations = await db
      .collection("calculations")
      .find({ userEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(calculations);
  } catch (error: any) {
    console.error("Failed to fetch calculations:", error);
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Save calculation
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const calculation = req.body;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("calculations").insertOne({
      ...calculation,
      userEmail: req.user.email,
      createdAt: new Date()
    });

    return res.status(201).json({
      message: "Calculation saved",
      id: result.insertedId
    });
  } catch (error: any) {
    console.error("Failed to save calculation:", error);
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Delete calculation
router.delete("/:id?", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ message: "Calculation ID is required" });
    }

    const client = await clientPromise;
    const db = client.db();

    let query: any = { userEmail: req.user.email };
    if (ObjectId.isValid(id)) {
      query.$or = [{ _id: new ObjectId(id) }, { id: id }];
    } else {
      query.id = id;
    }

    await db.collection("calculations").deleteOne(query);

    return res.status(200).json({ message: "Calculation deleted" });
  } catch (error: any) {
    console.error("Failed to delete calculation:", error);
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

export default router;
