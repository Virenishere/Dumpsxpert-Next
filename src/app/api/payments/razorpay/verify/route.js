import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '@/models/paymentSchema';
import User from '@/models/userSchema';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, userId } = await request.json();

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !amount) {
      console.error('Missing required fields:', { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount });
      return NextResponse.json({ success: false, error: 'Missing required payment details' }, { status: 400 });
    }

    // Validate environment variable
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay key secret not configured');
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      console.error('Signature verification failed:', { razorpay_payment_id, razorpay_order_id });
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    // Verify amount with Razorpay API
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.amount !== Math.round(amount * 100)) {
      console.error('Amount mismatch:', { provided: amount, actual: payment.amount / 100 });
      return NextResponse.json({ success: false, error: 'Amount mismatch' }, { status: 400 });
    }

    // Update user and create payment record concurrently
    const operations = [
      Payment.create({
        user: userId || null,
        amount: payment.amount / 100,
        currency: payment.currency || 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'completed',
      }),
    ];

    if (userId) {
      operations.push(
        User.findByIdAndUpdate(userId, {
          subscription: 'yes',
          role: 'student',
        }, { new: true })
      );
    }

    await Promise.all(operations);

    console.log('Payment verified and processed:', { razorpay_payment_id, razorpay_order_id, userId });
    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error('Payment verification failed:', {
      error: error.message,
      stack: error.stack,
      paymentId: razorpay_payment_id,
      userId: userId,
    });
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 500 });
  }
}