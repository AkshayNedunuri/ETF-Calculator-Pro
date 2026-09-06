import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        await client.db().admin().ping();
        return NextResponse.json({ status: "connected" });
    } catch (error: any) {
        let message = "Could not connect to MongoDB Atlas.";
        if (error.message.includes("IP address")) {
            message = "Your current IP address is not whitelisted in MongoDB Atlas.";
        } else if (error.message.includes("Authentication failed")) {
            message = "Invalid database credentials. Check your MONGODB_URI.";
        } else if (error.message.includes("timed out")) {
            message = "Connection timed out. Check your network or firewall.";
        }
        
        return NextResponse.json(
            { status: "disconnected", error: error.message, advice: message },
            { status: 503 }
        );
    }
}
