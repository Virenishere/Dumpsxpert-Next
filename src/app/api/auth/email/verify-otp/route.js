import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/userSchema";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() },
    }).select("+otp +otpExpires");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;

    await user.save();

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "OTP verification failed" },
      { status: 500 }
    );
  }
}
