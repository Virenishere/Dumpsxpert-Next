import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(request) {
  try {
    const { amount, currency } = await request.json();
    const options = {
      amount: Math.round(amount * 100),
      currency: currency || "INR",
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}