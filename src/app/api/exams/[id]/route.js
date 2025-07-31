import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongo";
import Exam from "@/models/examSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

// GET: Fetch an exam by ID
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const exam = await Exam.findById(params.id)
      .populate("lastUpdatedBy", "name email")
      .populate("productId", "title slug")
      .populate("courseId", "name");
    if (!exam) {
      return NextResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Exam retrieved successfully",
        data: exam,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch exam",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update an exam
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

    const data = await request.json();
    const { name, duration, numberOfQuestions, status, productId, courseId } = data;

    if (!name || !duration || !numberOfQuestions || !status || !productId || !courseId) {
      return NextResponse.json(
        { message: "Name, duration, number of questions, status, product ID, and course ID are required" },
        { status: 400 }
      );
    }

    const updated = await Exam.findByIdAndUpdate(
      params.id,
      { ...data, lastUpdatedBy: session.user.id },
      { new: true, runValidators: true }
    )
      .populate("lastUpdatedBy", "name email")
      .populate("productId", "title slug")
      .populate("courseId", "name");

    if (!updated) {
      return NextResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Exam updated successfully",
        exam: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      {
        message: "Failed to update exam",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete an exam
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

    const deleted = await Exam.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Exam deleted successfully",
        deletedId: params.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting exam:", error);
    return NextResponse.json(
      {
        message: "Failed to delete exam",
        error: error.message,
      },
      { status: 500 }
    );
  }
}