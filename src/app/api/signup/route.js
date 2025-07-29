const { NextResponse } = require("next/server");
const { connectMongoDB } = require("@/lib/mongodb");
const User = require("@/models/User");

async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    await connectMongoDB();
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return NextResponse.json({ message: "User not found or not verified" }, { status: 400 });
    }

    user.password = password;
    await user.save();

    return NextResponse.json({ message: "Account created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}

module.exports = { POST };
