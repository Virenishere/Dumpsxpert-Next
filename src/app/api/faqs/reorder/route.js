import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import FAQ from "@/models/faqSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// POST: Reorder FAQs
export async function POST(request) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Invalid items array" },
        { status: 400 }
      );
    }

    const updatePromises = items.map((item) =>
      FAQ.findByIdAndUpdate(
        item.id,
        { order: item.order, lastUpdatedBy: session.user.id },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: "FAQs reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering FAQs:", error);
    return NextResponse.json(
      {
        message: "Server error during FAQ reordering",
        error: error.message,
      },
      { status: 500 }
    );
  }
}