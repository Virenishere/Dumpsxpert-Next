import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import BlogList from "@/models/blogSchema";

// GET: Fetch all blogs with pagination and filtering
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const language = searchParams.get("language");

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status.toLowerCase();
    if (language) query.language = language;

    const totalDocs = await BlogList.countDocuments(query);
    const blogs = await BlogList.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return NextResponse.json(
      {
        message: "Blogs retrieved successfully",
        data: blogs,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalDocs / limit),
        hasPrevPage: page > 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return NextResponse.json(
      {
        message: "Server error while retrieving blogs",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new blog post
export async function POST(request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    const title = formData.get("title") || "Untitled Blog";
    const content = formData.get("content") || "Default content";
    const language = formData.get("language") || "en";
    const slug =
      formData.get("slug") ||
      (title
        ? title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        : "untitled-blog");
    const category = formData.get("category") || "";
    const metaTitle = formData.get("metaTitle") || title;
    const metaKeywords = formData.get("metaKeywords") || "";
    const metaDescription = formData.get("metaDescription") || "";
    const schema = formData.get("schema") || "";
    const status = formData.get("status") || "unpublish";
    const file = formData.get("file");

    const newBlogData = {
      title,
      content,
      language,
      slug,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
      status,
      imageUrl: file ? formData.get("imageUrl") : "", // Replace with Cloudinary upload logic
      imagePublicId: file ? formData.get("imagePublicId") : "", // Replace with Cloudinary public ID
    };

    const newBlog = new BlogList(newBlogData);
    await newBlog.save();

    return NextResponse.json(
      {
        message: "Blog created successfully",
        data: newBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        message: "Server error while creating blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}