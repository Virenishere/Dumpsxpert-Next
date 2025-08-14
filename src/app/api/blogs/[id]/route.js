// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import BlogList from "@/models/blogSchema";
// // import { deleteFromCloudinary } from "@/utils/cloudinary";

// // GET: Fetch a blog post by ID
// export async function GET(request, { params }) {
//   try {
//     await connectMongoDB();
//     const blog = await BlogList.findById(params.id);
//     if (!blog) {
//       return NextResponse.json({ message: "Blog not found" }, { status: 404 });
//     }
//     return NextResponse.json({ data: blog }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching blog by ID:", error);
//     return NextResponse.json(
//       { message: "Internal server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT: Update a blog post
// // export async function PUT(request, { params }) {
// //   try {
// //     await connectMongoDB();
// //     const formData = await request.formData();
// //     const title = formData.get("title") || "Untitled Blog";
// //     const content = formData.get("content") || "Default content";
// //     const language = formData.get("language") || "en";
// //     const slug =
// //       formData.get("slug") ||
// //       (title
// //         ? title
// //             .toLowerCase()
// //             .replace(/[^a-z0-9]+/g, "-")
// //             .replace(/^-|-$/g, "")
// //         : "untitled-blog");
// //     const category = formData.get("category") || "";
// //     const metaTitle = formData.get("metaTitle") || title;
// //     const metaKeywords = formData.get("metaKeywords") || "";
// //     const metaDescription = formData.get("metaDescription") || "";
// //     const schema = formData.get("schema") || "";
// //     const status = formData.get("status") || "unpublish";
// //     const file = formData.get("file");

// //     const updatedData = {
// //       title,
// //       content,
// //       language,
// //       slug,
// //       category,
// //       metaTitle,
// //       metaKeywords,
// //       metaDescription,
// //       schema,
// //       status,
// //     };

// //     if (file) {
// //       const oldBlog = await BlogList.findById(params.id);
// //       if (oldBlog && oldBlog.imagePublicId) {
// //         try {
// //           await deleteFromCloudinary(oldBlog.imagePublicId);
// //         } catch (cloudinaryError) {
// //           console.warn("Error deleting image from Cloudinary:", cloudinaryError);
// //         }
// //       }
// //       updatedData.imageUrl = formData.get("imageUrl"); // Replace with Cloudinary upload logic
// //       updatedData.imagePublicId = formData.get("imagePublicId"); // Replace with Cloudinary public ID
// //     }

// //     const updatedBlog = await BlogList.findByIdAndUpdate(params.id, updatedData, {
// //       new: true,
// //       runValidators: true,
// //     });

// //     if (!updatedBlog) {
// //       return NextResponse.json({ message: "Blog not found" }, { status: 404 });
// //     }

// //     return NextResponse.json(
// //       {
// //         message: "Blog updated successfully",
// //         data: updatedBlog,
// //       },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.error("Error updating blog:", error);
// //     return NextResponse.json(
// //       {
// //         message: "Server error while updating blog",
// //         error: error.message,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // DELETE: Delete a blog post
// // export async function DELETE(request, { params }) {
// //   try {
// //     await connectMongoDB();
// //     const blog = await BlogList.findById(params.id);
// //     if (!blog) {
// //       return NextResponse.json({ message: "Blog not found" }, { status: 404 });
// //     }

// //     if (blog.imagePublicId) {
// //       try {
// //         await deleteFromCloudinary(blog.imagePublicId);
// //       } catch (cloudinaryError) {
// //         console.warn("Error deleting image from Cloudinary:", cloudinaryError);
// //       }
// //     }

// //     await BlogList.findByIdAndDelete(params.id);

// //     return NextResponse.json(
// //       {
// //         message: "Blog deleted successfully",
// //         deletedId: params.id,
// //       },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.error("Error deleting blog:", error);
// //     return NextResponse.json(
// //       {
// //         message: "Server error during blog deletion",
// //         error: error.message,
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }