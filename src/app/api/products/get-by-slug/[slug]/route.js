import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Product from "@/models/productListSchema";

// GET: Fetch a product by slug
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const product = await Product.findOne({ slug: params.slug }).populate(
      "lastUpdatedBy",
      "name email"
    );
    if (!product) {
      return NextResponse.json(
        { message: "Product not found with this slug" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Product retrieved successfully by slug", data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}