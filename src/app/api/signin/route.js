import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/userSchema";
import { signIn } from "@/lib/auth/authOptions";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isVerified) {
      return NextResponse.json(
        { message: "User not found or not verified. Please sign up." },
        { status: 400 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const result = await signIn("email", {
      email,
      redirect: false,
    });

    if (!result.ok) {
      return NextResponse.json(
        { message: "Sign-in failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Sign-in successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "Sign-in failed" },
      { status: 500 }
    );
  }
}