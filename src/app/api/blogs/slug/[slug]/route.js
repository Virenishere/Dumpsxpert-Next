import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import BlogList from "@/models/blogSchema";

// GET: Fetch a blog post by slug
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const blog = await BlogList.findOne({ slug: params.slug });
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Blog retrieved successfully",
        data: blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving blog by slug:", error);
    return NextResponse.json(
      {
        message: "Server error while retrieving blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}