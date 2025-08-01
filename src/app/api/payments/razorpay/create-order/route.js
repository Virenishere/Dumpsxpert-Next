import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance once
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const currency = body.currency || 'INR';

    // Input validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid or missing amount. Must be a number greater than 0.' },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    }, { status: 200 });

  } catch (error) {
    console.error('[RAZORPAY_ORDER_ERROR]', error);
    return NextResponse.json(
      { error: 'Unable to create order. Please try again later.' },
      { status: 500 }
    );
  }
}
