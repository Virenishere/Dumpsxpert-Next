import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    // Get stored OTP data
    const storedData = global.otpStore?.get(email);
    
    if (!storedData) {
      return NextResponse.json(
        { message: 'OTP expired or not found' },
        { status: 400 }
      );
    }

    // Check if OTP is expired (10 minutes)
    const isExpired = new Date() - new Date(storedData.createdAt) > 10 * 60 * 1000;
    if (isExpired) {
      global.otpStore.delete(email);
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      if (storedData.attempts >= 3) {
        global.otpStore.delete(email);
        return NextResponse.json(
          { message: 'Too many failed attempts. Please request a new OTP' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP verified successfully
    global.otpStore.delete(email);
    return NextResponse.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}