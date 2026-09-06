import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: "Token and new password are required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        // 1. Hash the incoming token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 2. Find the user with that token (and ensuring it hasn't expired)
        const user = await db.collection("users").findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json(
                { message: "Token is invalid or has expired." },
                { status: 400 }
            );
        }

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Update password and clear the reset token
        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpiry: "" }
            }
        );

        return NextResponse.json(
            { message: "Password updated successfully! You can now log in." },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { message: "An error occurred", error: error.message },
            { status: 500 }
        );
    }
}
