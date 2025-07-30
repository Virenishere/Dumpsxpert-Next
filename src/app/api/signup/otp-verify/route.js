// src/app/api/signup/otp-verify/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/userSchema";
import Otp from "@/models/otpSchema";

export async function POST(request) {
  try {
    const { email, otp, password, name } = await request.json();

    if (!email || !otp || !password || !name) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectMongoDB();
    const otpRecord = await Otp.findOne({ email, otp, otpExpires: { $gt: new Date() } });
    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteOne({ email });
      return NextResponse.json({ message: "User exists, please sign in." }, { status: 400 });
    }

    const user = new User({ email, password, name, isVerified: true });
    await user.save();
    await Otp.deleteOne({ email });

    // **DON’T** attempt server‐side signIn here.
    return NextResponse.json(
      { message: "Account created! Now sign in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
