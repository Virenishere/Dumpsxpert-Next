import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth/authOptions';
import UserInfo from '@/models/userInfoSchema';
import { connectMongoDB } from '@/lib/mongo';

export async function GET() {
  console.log('Received request to GET /api/user/me at', new Date().toISOString());
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', JSON.stringify(session, null, 2));

    if (!session || !session.user?.email) {
      console.log('Unauthorized: No valid session or user email');
      return NextResponse.json(
        { error: 'Unauthorized access: No valid session or email' },
        { status: 401 }
      );
    }

    await connectMongoDB();
    console.log('MongoDB connected, querying user with email:', session.user.email);

    const userInfo = await UserInfo.findOne({ email: session.user.email }).select(
      'name email phone address dob gender bio profileImage role subscription isVerified createdAt'
    );

    if (!userInfo) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User found:', JSON.stringify(userInfo, null, 2));
    return NextResponse.json({
      id: userInfo._id.toString(),
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      dob: userInfo.dob,
      gender: userInfo.gender,
      bio: userInfo.bio,
      profileImage: userInfo.profileImage,
      role: userInfo.role,
      subscription: userInfo.subscription,
      isVerified: userInfo.isVerified,
      createdAt: userInfo.createdAt,
    });
  } catch (error) {
    console.error('Error fetching user in /api/user/me:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  console.log('Received request to PUT /api/user/me at', new Date().toISOString());
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', JSON.stringify(session, null, 2));

    if (!session || !session.user?.email) {
      console.log('Unauthorized: No valid session or user email');
      return NextResponse.json(
        { error: 'Unauthorized access: No valid session or email' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Update data:', JSON.stringify(data, null, 2));

    if (!data || Object.keys(data).length === 0) {
      console.log('No update data provided');
      return NextResponse.json(
        { error: 'No update data provided' },
        { status: 400 }
      );
    }

    const allowedUpdates = [
      'name',
      'phone',
      'address',
      'dob',
      'gender',
      'bio',
      'profileImage',
    ];

    const updates = Object.keys(data)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        if (key === 'dob' && data[key]) {
          const date = new Date(data[key]);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format for dob');
          }
          obj[key] = date;
        } else if (data[key] !== null && data[key] !== undefined) {
          obj[key] = data[key];
        }
        return obj;
      }, {});

    if (Object.keys(updates).length === 0) {
      console.log('No valid fields provided for update');
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    await connectMongoDB();
    console.log('MongoDB connected, updating user with email:', session.user.email);

    const userInfo = await UserInfo.findOneAndUpdate(
      { email: session.user.email },
      { $set: updates },
      { new: true, runValidators: true }
    ).select(
      'name email phone address dob gender bio profileImage role subscription isVerified createdAt'
    );

    if (!userInfo) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User updated:', JSON.stringify(userInfo, null, 2));
    return NextResponse.json({
      id: userInfo._id.toString(),
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      dob: userInfo.dob,
      gender: userInfo.gender,
      bio: userInfo.bio,
      profileImage: userInfo.profileImage,
      role: userInfo.role,
      subscription: userInfo.subscription,
      isVerified: userInfo.isVerified,
      createdAt: userInfo.createdAt,
    });
  } catch (error) {
    console.error('Error updating user in /api/user/me:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}