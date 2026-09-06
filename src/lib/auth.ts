import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                let client;
                try {
                    client = await clientPromise;
                } catch (dbError: any) {
                    console.error("Database connection error:", dbError);
                    throw new Error("Service unavailable. Please try again later.");
                }

                const db = client.db();

                // Find user by email
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user) {
                    // Return null so NextAuth shows CredentialsSignin error
                    return null;
                }

                if (!user.password) {
                    // Account exists but was created via OAuth (no password)
                    return null;
                }

                // Verify password
                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordCorrect) {
                    // Return null — NextAuth maps this to CredentialsSignin error
                    return null;
                }

                return { 
                    id: user._id.toString(), 
                    name: user.name, 
                    email: user.email 
                };
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, account, profile }: { token: JWT; user?: any; account?: any; profile?: any }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image ?? (profile as any)?.picture ?? null;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = (token.picture as string) ?? session.user.image ?? null;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "a-very-secret-key-for-development",
};
