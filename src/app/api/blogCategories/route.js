import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import BlogCategory from "@/models/blogCategorySchema";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// GET: Fetch all blog categories
export async function GET() {
  try {
    await connectMongoDB();
    const categories = await BlogCategory.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching all blog categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new blog category
export async function POST(request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    const sectionName = formData.get("sectionName");
    const category = formData.get("category");
    const metaTitle = formData.get("metaTitle");
    const metaKeywords = formData.get("metaKeywords");
    const metaDescription = formData.get("metaDescription");
    const schema = formData.get("schema");
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Note: In a real implementation, upload the file to Cloudinary here
    // For this example, assume imageUrl and imagePublicId are provided
    const imageUrl = formData.get("imageUrl"); // Replace with Cloudinary upload logic
    const imagePublicId = formData.get("imagePublicId"); // Replace with Cloudinary public ID

    const newCategory = new BlogCategory({
      sectionName,
      category,
      imageUrl,
      imagePublicId,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    });

    const saved = await newCategory.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Create Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}