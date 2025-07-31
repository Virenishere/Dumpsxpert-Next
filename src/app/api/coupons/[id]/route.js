import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Coupon from "@/models/couponSchema";

// GET: Fetch a coupon by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const coupon = await Coupon.findById(params.id);
    if (!coupon) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(coupon, { status: 200 });
  } catch (error) {
    console.error("Error retrieving coupon:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a coupon
export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    const updated = await Coupon.findByIdAndUpdate(params.id, await request.json(), {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { message: "Failed to update coupon", error: error.message },
      { status: 400 }
    );
  }
}

// DELETE: Delete a coupon
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const deleted = await Coupon.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Coupon deleted", id: deleted._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}