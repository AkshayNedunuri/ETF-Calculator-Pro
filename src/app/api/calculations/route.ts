import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();
        
        const calculations = await db
            .collection("calculations")
            .find({ userEmail: session.user.email })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(calculations);
    } catch (error: any) {
        console.error("Failed to fetch calculations:", error);
        return NextResponse.json(
            { message: "Database connection failed", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const calculation = await request.json();
        
        const client = await clientPromise;
        const db = client.db();
        
        const result = await db.collection("calculations").insertOne({
            ...calculation,
            userEmail: session.user.email,
            createdAt: new Date()
        });

        return NextResponse.json({ 
            message: "Calculation saved", 
            id: result.insertedId 
        }, { status: 201 });
    } catch (error: any) {
        console.error("Failed to save calculation:", error);
        return NextResponse.json(
            { message: "Database connection failed", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();
        
        const client = await clientPromise;
        const db = client.db();
        
        await db.collection("calculations").deleteOne({
            _id: new ObjectId(id),
            userEmail: session.user.email
        });

        return NextResponse.json({ message: "Calculation deleted" });
    } catch (error: any) {
        console.error("Failed to delete calculation:", error);
        return NextResponse.json(
            { message: "Database connection failed", error: error.message },
            { status: 500 }
        );
    }
}
