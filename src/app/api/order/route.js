import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongo';
import Order from '@/models/orderSchema';
import User from '@/models/userSchema'; // This is the NextAuth User collection
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(request) {
  try {
    console.log('Route hit: /api/order [POST]');
    await connectMongoDB();

    // Log cookies for debugging
    const cookies = request.headers.get('cookie');
    console.log('Cookies received:', cookies);

    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session || !session.user?.id || !session.user?.email) {
      console.error('Unauthorized: No valid session', {
        sessionExists: !!session,
        userId: session?.user?.id || 'none',
        userEmail: session?.user?.email || 'none',
      });
      return NextResponse.json(
        { error: 'Unauthorized: Please log in' },
        { status: 401 }
      );
    }

    const { userId, items, totalAmount, paymentMethod, paymentId } = await request.json();

    // Validate required fields
    if (!userId || !items || !items.length || !totalAmount || !paymentMethod || !paymentId) {
      console.error('Missing required fields:', {
        userId,
        items,
        totalAmount,
        paymentMethod,
        paymentId,
      });
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // Validate userId (from `User` collection)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid userId:', userId);
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Verify the user in the `User` collection
    const user = await User.findById(userId); // Query the `User` collection
    if (!user) {
      console.error('User not found in User collection:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      );
    }

    // Verify the email matches the session email
    if (user.email !== session.user.email) {
      console.error('Email mismatch:', {
        providedEmail: user.email,
        sessionEmail: session.user.email,
      });
      return NextResponse.json(
        { error: 'Unauthorized: Email mismatch' },
        { status: 403 }
      );
    }

    // Validate items and convert courseId to ObjectId
    if (!Array.isArray(items) || items.some(item => !item._id || !item.title || !item.price)) {
      console.error('Invalid items format:', items);
      return NextResponse.json(
        { error: 'Invalid items format' },
        { status: 400 }
      );
    }

    // Validate courseId as ObjectId
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item._id)) {
        console.error('Invalid courseId:', item._id);
        return NextResponse.json(
          { error: `Invalid course ID format: ${item._id}` },
          { status: 400 }
        );
      }
    }

    // Validate totalAmount
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      console.error('Invalid totalAmount:', totalAmount);
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Map cartItems to courseDetails
    const courseDetails = items.map(item => ({
      courseId: new mongoose.Types.ObjectId(item._id),
      name: item.title,
      price: item.price,
      sapExamCode: item.sapExamCode || '',
      category: item.category || '',
      sku: item.sku || '',
      samplePdfUrl: item.samplePdfUrl || '',
      mainPdfUrl: item.mainPdfUrl || '',
      slug: item.slug || '',
    }));

    // Create order
    const order = await Order.create({
      user: userId, // Use the userId from the `User` collection
      courseDetails,
      totalAmount,
      paymentMethod,
      paymentId,
      currency: 'INR',
      status: 'completed',
    });

    console.log('Order created:', { orderId: order._id, orderNumber: order.orderNumber, userId });
    return NextResponse.json({ success: true, orderId: order._id, orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Order creation failed:', {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: `Order creation failed: ${error.message}` },
      { status: 500 }
    );
  }
}