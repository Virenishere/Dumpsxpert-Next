import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import ProductCategory from "@/models/productCategorySchema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectMongoDB();
    const categories = await ProductCategory.find().lean();
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
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
    const name = formData.get("name")?.toString().trim();
    const status = formData.get("status")?.toString().trim() || "Ready";
    const file = formData.get("image");

    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!["Ready", "Not Ready"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    const uploadResult = await uploadToCloudinary(file);

    if (!uploadResult.secure_url || !uploadResult.public_id) {
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