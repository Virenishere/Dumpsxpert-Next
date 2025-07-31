import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import AnnouncementSetting from "@/models/announcementSchema";
import { deleteFromCloudinary } from "@/utils/cloudinary";

// GET: Fetch the latest announcement setting
export async function GET() {
  try {
    await connectMongoDB();
    const setting = await AnnouncementSetting.findOne().sort({ createdAt: -1 });
    return NextResponse.json(setting || {}, { status: 200 });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Update or create announcement setting
export async function POST(request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    const active = formData.get("active") === "true";
    const delay = parseFloat(formData.get("delay")) || 2.0;
    const file = formData.get("file");

    const existing = await AnnouncementSetting.findOne();

    let update = {
      active,
      delay,
    };

    if (file) {
      if (existing?.imagePublicId) {
        await deleteFromCloudinary(existing.imagePublicId);
      }
      // Note: In a real implementation, you would need to handle file upload to Cloudinary here
      // For this example, we'll assume the file is already uploaded and we receive the URL and public ID
      update.imageUrl = formData.get("imageUrl"); // Replace with actual Cloudinary upload logic
      update.imagePublicId = formData.get("imagePublicId"); // Replace with actual Cloudinary public ID
    } else if (!existing?.imageUrl) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const updated = await AnnouncementSetting.findOneAndUpdate(
      {},
      update,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      { message: "Updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}