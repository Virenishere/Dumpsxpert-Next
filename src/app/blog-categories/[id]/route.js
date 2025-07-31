import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import BlogCategory from "@/models/blogCategorySchema";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// GET: Fetch a blog category by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const category = await BlogCategory.findById(params.id);
    if (!category) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("❌ Error in getBlogCategoryById:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a blog category
export async function PUT(request, { params }) {
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

    const updateData = {
      sectionName,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    };

    if (file) {
      const oldCategory = await BlogCategory.findById(params.id);
      if (oldCategory && oldCategory.imagePublicId) {
        await deleteFromCloudinary(oldCategory.imagePublicId);
      }
      // Note: In a real implementation, upload the file to Cloudinary here
      updateData.imageUrl = formData.get("imageUrl"); // Replace with Cloudinary upload logic
      updateData.imagePublicId = formData.get("imagePublicId"); // Replace with Cloudinary public ID
    }

    const updatedCategory = await BlogCategory.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a blog category
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const category = await BlogCategory.findById(params.id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    await BlogCategory.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}