import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email });

        if (existingUser) {
            // User already exists. Check if password matches as per requirement:
            // "if he type same email with different password mention that it was wrong"
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            
            if (!isPasswordCorrect) {
                 return NextResponse.json(
                    { message: "This email is already registered, but the password entered is incorrect. Please use your existing password." },
                    { status: 400 }
                );
            } else {
                return NextResponse.json(
                    { message: "Account already exists with this password. Please log in." },
                    { status: 409 }
                );
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const result = await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: "User created successfully", userId: result.insertedId },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "An error occurred during signup", error: error.message },
            { status: 500 }
        );
    }
}
