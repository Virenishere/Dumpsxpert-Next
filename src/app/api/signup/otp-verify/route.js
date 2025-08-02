import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongo';
import OTP from '@/models/otpSchema';
import UserInfo from '@/models/userInfoSchema';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, otp, password, name } = await request.json();
    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'Email, OTP, and password are required' }, { status: 400 });
    }

    await connectMongoDB();
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || Date.now() > new Date(otpRecord.otpExpires).getTime()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    let user = await UserInfo.findOne({ email });
    if (!user) {
      // Dynamically import the NextAuth user model (authUsers)
      const mongoose = require('mongoose');
      const authUserModel = mongoose.models.authUsers || mongoose.model('authUsers', new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        name: { type: String },
        image: { type: String },
        emailVerified: { type: Date },
      }, { collection: 'authUsers' }));

      // Create a new NextAuth user
      const authUser = await authUserModel.create({
        email,
        name: name || email.split('@')[0],
        image: '',
        emailVerified: new Date(),
      });

      user = new UserInfo({
        authUserId: authUser._id,
        email,
        name: name || email.split('@')[0],
        password: password, // Let pre-save hook hash it
        isVerified: true,
        role: 'guest',
        subscription: 'no',
        provider: 'credentials',
        providerId: '',
        phone: '',
        address: '',
        bio: '',
        profileImage: '',
        createdAt: new Date(),
      });
      await user.save();
    } else {
      user.password = password;
      user.isVerified = true;
      // If authUserId is missing, try to link it
      if (!user.authUserId) {
        const mongoose = require('mongoose');
        const authUserModel = mongoose.models.authUsers || mongoose.model('authUsers', new mongoose.Schema({
          email: { type: String, required: true, unique: true },
          name: { type: String },
          image: { type: String },
          emailVerified: { type: Date },
        }, { collection: 'authUsers' }));
        let authUser = await authUserModel.findOne({ email });
        if (!authUser) {
          authUser = await authUserModel.create({
            email,
            name: user.name || email.split('@')[0],
            image: '',
            emailVerified: new Date(),
          });
        }
        user.authUserId = authUser._id;
      }
      await user.save();
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    // Return a redirect instruction for client-side to the correct dashboard based on role
    let dashboardPath = '/dashboard/guest';
    if (user.role === 'admin') dashboardPath = '/dashboard/admin';
    else if (user.subscription === 'yes') dashboardPath = '/dashboard/student';
    // else remains guest
    return NextResponse.json({ message: 'Email verified successfully', redirect: dashboardPath });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}