import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import ProductCategory from "@/models/productCategorySchema";
import { deleteFromCloudinary } from "@/utils/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch a product category by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const category = await ProductCategory.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Error fetching category", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a product category
export async function PUT(request, { params }) {
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
    const status = formData.get("status");
    const file = formData.get("file");

    const existing = await ProductCategory.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const updatedFields = {
      name: name || existing.name,
      status: status || existing.status,
    };

    if (file) {
      if (existing.public_id) {
        await deleteFromCloudinary(existing.public_id);
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
      updatedFields.imageUrl = uploadResult.secure_url;
      updatedFields.public_id = uploadResult.public_id;
    }

    const updated = await ProductCategory.findByIdAndUpdate(
      params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Server error while updating category", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product category
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const category = await ProductCategory.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (category.public_id) {
      await deleteFromCloudinary(category.public_id);
    }

    await ProductCategory.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Category deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Error deleting category", error: error.message },
      { status: 500 }
    );
  }
}