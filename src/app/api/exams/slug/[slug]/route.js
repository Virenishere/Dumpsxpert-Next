import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Exam from "@/models/examCodeSchema";
import Product from "@/models/productListSchema";

// GET: Fetch exams by product slug
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const { slug } = params;

    // Find the product by slug
    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Find all published exams for this product
    const exams = await Exam.find({ 
      productId: product._id,
      status: "published"
    })
    .select('name code duration sampleDuration passingScore eachQuestionMark sampleInstructions')
    .lean();

    if (!exams || exams.length === 0) {
      return NextResponse.json(
        { message: "No published exams found for this product" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Exams retrieved successfully",
        data: exams,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching exams for product slug:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch exams for product slug",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
