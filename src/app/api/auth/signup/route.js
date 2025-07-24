import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import User from '@/models/userSchema';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      role: 'guest',
      isVerified: true, // Since we've verified via OTP
      provider: 'email'
    });

    await user.save();

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    );
  }
}