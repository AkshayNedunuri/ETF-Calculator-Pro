import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long." },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        const client = await clientPromise;
        const db = client.db();

        // Check if user already exists in database
        const existingUser = await db.collection("users").findOne({ email: normalizedEmail });

        if (existingUser) {
            return NextResponse.json(
                { message: "An account with this email already exists in the database. Please log in." },
                { status: 409 }
            );
        }

        // Hash password securely with bcrypt (12 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 12);

        // Save user directly to MongoDB database
        const result = await db.collection("users").insertOne({
            name: (name || "").trim() || normalizedEmail.split("@")[0],
            email: normalizedEmail,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(
            { 
                success: true,
                message: "User account and password saved securely to database.",
                userId: result.insertedId.toString()
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Database signup error:", error);
        return NextResponse.json(
            { 
                message: "Database error occurred while creating account.",
                error: error.message 
            },
            { status: 500 }
        );
    }
}
