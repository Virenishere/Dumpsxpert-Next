import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import ProductCategory from "@/models/productCategorySchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all product categories
export async function GET() {
  try {
    await connectMongoDB();
    const categories = await ProductCategory.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new product category
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

    const formData = await request.formData();
    const name = formData.get("name");
    const status = formData.get("status") || "Ready";
    const file = formData.get("file");

    if (!name || !file) {
      return NextResponse.json(
        { message: "Name and image are required" },
        { status: 400 }
      );
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "product-categories" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      file.stream().pipe(stream);
    });

    const newCategory = new ProductCategory({
      name,
      status,
      imageUrl: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });

    const saved = await newCategory.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("❌ CREATE ERROR:", error);
    return NextResponse.json(
      { message: "Server error while creating category", error: error.message },
      { status: 500 }
    );
  }
}