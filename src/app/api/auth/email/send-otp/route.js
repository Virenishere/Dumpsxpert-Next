import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

let otpStore = {}; // Temporary in-memory store (better use Redis)

export async function POST(req) {
  const { email } = await req.json();
  await dbConnect();

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = otp;

  console.log(`OTP for ${email}: ${otp}`); // TODO: Send via email service

  return NextResponse.json({ message: "OTP sent" });
}
