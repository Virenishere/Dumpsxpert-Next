import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
// import AnnouncementSetting from "@/models/AnnouncementSetting";
import { deleteFromCloudinary } from "@/utils/cloudinary";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth/authOptions";
import cloudinary from "cloudinary";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// GET: Fetch the latest announcement setting
export async function GET() {
  try {
    await connectMongoDB();
    // const setting = await AnnouncementSetting.findOne()
    //   .sort({ createdAt: -1 })
    //   .populate("lastUpdatedBy", "name email");
    // return NextResponse.json(setting || {}, { status: 200 });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Update or create announcement setting
// export async function POST(request) {
//   try {
//     await connectMongoDB();
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "admin") {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const formData = await request.formData();
//     const active = formData.get("active") === "true";
//     const delay = parseFloat(formData.get("delay")) || 2.0;
//     const file = formData.get("file");

//     const existing = await AnnouncementSetting.findOne();

//     let update = {
//       active,
//       delay,
//       lastUpdatedBy: session.user.id,
//     };

//     if (file) {
//       if (existing?.imagePublicId) {
//         try {
//           await deleteFromCloudinary(existing.imagePublicId);
//         } catch (cloudinaryError) {
//           console.warn("Error deleting old image from Cloudinary:", cloudinaryError);
//         }
//       }
//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.v2.uploader.upload_stream(
//           { folder: "announcements" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         file.stream().pipe(stream);
//       });
//       update.imageUrl = uploadResult.secure_url;
//       update.imagePublicId = uploadResult.public_id;
//     } else if (!existing?.imageUrl) {
//       return NextResponse.json(
//         { message: "Image is required" },
//         { status: 400 }
//       );
//     }

//     const updated = await AnnouncementSetting.findOneAndUpdate(
//       {},
//       update,
//       {
//         upsert: true,
//         new: true,
//         runValidators: true,
//       }
//     ).populate("lastUpdatedBy", "name email");

//     return NextResponse.json(
//       { message: "Announcement updated successfully", data: updated },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating announcement:", error);
//     return NextResponse.json(
//       { message: "Internal server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }