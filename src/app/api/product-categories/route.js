import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import ProductCategory from "@/models/productCategorySchema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectMongoDB();
    const categories = await ProductCategory.find().lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectMongoDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const status = formData.get("status") || "Ready";
    const file = formData.get("image");

    if (!name || !file) {
      return NextResponse.json(
        { message: "Name and image required" },
        { status: 400 }
      );
    }

    const uploadResult = await uploadToCloudinary(file);

    if (!uploadResult.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    const newCategory = new ProductCategory({
      name,
      status,
      image: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });

    const savedCategory = await newCategory.save();
    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
