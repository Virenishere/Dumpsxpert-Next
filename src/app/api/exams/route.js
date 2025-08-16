// import { NextResponse } from "next/server";
// import { connectMongoDB } from "@/lib/mongo";
// import Exam from "@/models/examSchema";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth/authOptions";

// // GET: Fetch all exams
// export async function GET() {
//   try {
//     await connectMongoDB();
//     const exams = await Exam.find()
//       .populate("lastUpdatedBy", "name email")
//       .populate("productId", "title slug")
//       .populate("courseId", "name"); // Assuming Course model has a name field
//     return NextResponse.json(
//       {
//         message: "Exams retrieved successfully",
//         data: exams,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching exams:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to fetch exams",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

// // POST: Create a new exam
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

//     const data = await request.json();
//     const { name, duration, numberOfQuestions, status, productId, courseId } = data;

//     if (!name || !duration || !numberOfQuestions || !status || !productId || !courseId) {
//       return NextResponse.json(
//         { message: "Name, duration, number of questions, status, product ID, and course ID are required" },
//         { status: 400 }
//       );
//     }

//     const exam = new Exam({
//       ...data,
//       lastUpdatedBy: session.user.id,
//     });

//     const saved = await exam.save();
//     const populated = await Exam.findById(saved._id)
//       .populate("lastUpdatedBy", "name email")
//       .populate("productId", "title slug")
//       .populate("courseId", "name");

//     return NextResponse.json(
//       {
//         message: "Exam created successfully",
//         exam: populated,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating exam:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to create exam",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
// src/app/api/announcements/route.js
export async function GET() {
  return new Response("Not implemented", { status: 404 });
}
