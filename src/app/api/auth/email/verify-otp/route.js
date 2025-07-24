import { NextResponse } from "next/server";

let otpStore = {}; // import from send-otp if using same memory

export async function POST(req) {
  const { email, otp } = await req.json();

  if (otpStore[email] !== otp) {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }

  delete otpStore[email];
  return NextResponse.json({ message: "OTP verified" });
}
