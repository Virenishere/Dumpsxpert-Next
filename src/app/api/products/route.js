import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Product from "@/models/productListSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all products with pagination and filtering
export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const totalDocs = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("lastUpdatedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return NextResponse.json(
      {
        message: "Products retrieved successfully",
        data: products,
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(totalDocs / limit),
        hasPrevPage: page > 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new product
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
    const fields = [
      "sapExamCode",
      "title",
      "price",
      "category",
      "status",
      "action",
      "onlinePriceInr",
      "onlinePriceUsd",
      "onlineMrpInr",
      "onlineMrpUsd",
      "comboPriceInr",
      "comboPriceUsd",
      "comboMrpInr",
      "comboMrpUsd",
      "dumpsPriceInr",
      "dumpsPriceUsd",
      "dumpsMrpInr",
      "dumpsMrpUsd",
      "sku",
      "longDescription",
      "Description",
      "slug",
      "metaTitle",
      "metaKeywords",
      "metaDescription",
      "schema",
    ];
    const data = {};
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) data[field] = value;
    });

    const imageFile = formData.get("image");
    if (!imageFile) {
      return NextResponse.json(
        { message: "Product image is required" },
        { status: 400 }
      );
    }

    const imageResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      imageFile.stream().pipe(stream);
    });

    let samplePdfUrl = "";
    const samplePdfFile = formData.get("samplePdf");
    if (samplePdfFile) {
      const samplePdfResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw", folder: "product_pdfs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        samplePdfFile.stream().pipe(stream);
      });
      samplePdfUrl = samplePdfResult.secure_url;
    }

    let mainPdfUrl = "";
    const mainPdfFile = formData.get("mainPdf");
    if (mainPdfFile) {
      const mainPdfResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw", folder: "product_pdfs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        mainPdfFile.stream().pipe(stream);
      });
      mainPdfUrl = mainPdfResult.secure_url;
    }

    const newProduct = new Product({
      ...data,
      imageUrl: imageResult.secure_url,
      samplePdfUrl,
      mainPdfUrl,
      lastUpdatedBy: session.user.id,
    });

    const saved = await newProduct.save();
    return NextResponse.json(
      { message: "Product created successfully", data: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        message: "Server error during product creation",
        error: error.message,
      },
      { status: 500 }
    );
  }
}