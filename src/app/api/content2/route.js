import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Content from "@/models/Content2";

// POST - Save content
export async function POST(req) {
  try {
    const { html } = await req.json();
    if (!html) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // For this example, we just update or create a single content entry
    let contentDoc = await Content.findOne();
    if (contentDoc) {
      contentDoc.html = html;
      await contentDoc.save();
    } else {
      contentDoc = await Content.create({ html });
    }

    return NextResponse.json({ success: true, data: contentDoc });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Retrieve content
export async function GET() {
  try {
    await connectMongoDB();
    const contentDoc = await Content.findOne();
    return NextResponse.json(contentDoc || { html: "" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
