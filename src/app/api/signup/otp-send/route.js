import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectMongoDB } from "@/lib/mongo";
import UserInfo from "@/models/userInfoSchema";
import Otp from "@/models/otpSchema";

export async function POST(req) {
  try {
    const { email } = await req.json();

    //console.log("Received OTP send request with email:", email);

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const existingUser = await UserInfo.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "User already exists. Please sign in." },
        { status: 400 }
      );
    }

    // Rate limiting
    const maxAttempts = 5;
    const otpRecord = await Otp.findOne({ email });
    if (otpRecord && otpRecord.attempts >= maxAttempts) {
      return NextResponse.json(
        { message: "Too many OTP requests. Try again later." },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update or create OTP record
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, otpExpires, $inc: { attempts: 1 } },
      { upsert: true, new: true }
    );

    // Verify SMTP credentials
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.error("SMTP credentials are missing");
      return NextResponse.json(
        { message: "Server configuration error: Missing SMTP credentials" },
        { status: 500 }
      );
    }

    //console.log("EMAIL_SERVER_USER:", process.env.EMAIL_SERVER_USER);
    //console.log("EMAIL_SERVER_PASSWORD:", process.env.EMAIL_SERVER_PASSWORD ? "[Redacted]" : "Missing");
    //console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
      secure: false, // Use TLS for port 587
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Verification Code - DumpsXpert",
      text: `Your verification code is: ${otp}. Valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">DumpsXpert Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    //console.log("OTP sent successfully to:", email);
    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: `Failed to send OTP: ${error.message}` },
      { status: 500 }
    );
  }
}
