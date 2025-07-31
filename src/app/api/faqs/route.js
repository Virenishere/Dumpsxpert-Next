import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import FAQ from "@/models/faqSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// GET: Fetch all FAQs with filtering
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    const query = {};
    if (category) query.category = category;
    if (isActive !== null && isActive !== undefined) query.isActive = isActive === "true";

    const faqs = await FAQ.find(query)
      .populate("lastUpdatedBy", "name email")
      .sort({ category: 1, order: 1 });

    return NextResponse.json(
      {
        message: "FAQs retrieved successfully",
        data: faqs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving FAQs:", error);
    return NextResponse.json(
      {
        message: "Server error while retrieving FAQs",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new FAQ
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

    const { question, answer, category, order, isActive } = await request.json();
    if (!question || !answer || !category) {
      return NextResponse.json(
        { message: "Question, answer, and category are required" },
        { status: 400 }
      );
    }

    const newFAQ = new FAQ({
      question,
      answer,
      category,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      lastUpdatedBy: session.user.id,
    });

    const savedFAQ = await newFAQ.save();

    return NextResponse.json(
      {
        message: "FAQ created successfully",
        data: savedFAQ,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      {
        message: "Server error during FAQ creation",    
        error: error.message,
      },
      { status: 500 }
    );
  }
}