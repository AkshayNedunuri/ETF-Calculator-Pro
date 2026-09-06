import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        // 1. Find the user
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            // For security, don't reveal if user exists or not. 
            // But for this demo, we'll be helpful.
            return NextResponse.json(
                { message: "If an account with that email exists, a reset link has been sent." },
                { status: 200 }
            );
        }

        // 2. Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // 3. Set expiry (1 hour from now)
        const expiry = new Date(Date.now() + 3600000);

        // 4. Update user document
        await db.collection("users").updateOne(
            { email },
            { 
                $set: { 
                    resetToken: hashedToken, 
                    resetTokenExpiry: expiry 
                } 
            }
        );

        // 5. Build reset URL (Simulated Email)
        const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        
        console.log(`[AUTH] Password reset link for ${email}: ${resetUrl}`);

        // In a real app, you would use an email service (SendGrid, Mailgun, etc.) here.
        // For development, we'll return it so the user can test the flow.
        return NextResponse.json(
            { 
                message: "Reset link generated successfully (Simulated Email)",
                debugUrl: resetUrl 
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { message: "An error occurred", error: error.message },
            { status: 500 }
        );
    }
}
