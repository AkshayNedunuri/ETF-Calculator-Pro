import { Router } from "express";
import clientPromise from "../config/database";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const client = await clientPromise;
    await client.db().admin().ping();
    return res.status(200).json({ status: "connected" });
  } catch (error: any) {
    let message = "Could not connect to MongoDB Atlas.";
    if (error.message.includes("IP address")) {
      message = "Your current IP address is not whitelisted in MongoDB Atlas.";
    } else if (error.message.includes("Authentication failed")) {
      message = "Invalid database credentials. Check your MONGODB_URI.";
    } else if (error.message.includes("timed out")) {
      message = "Connection timed out. Check your network or firewall.";
    }

    return res.status(503).json({
      status: "disconnected",
      error: error.message,
      advice: message
    });
  }
});

export default router;
