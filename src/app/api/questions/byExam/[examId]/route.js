// file: src/app/api/questions/byExam/[examId]/route.js
import { connectMongoDB } from "@/lib/mongo";
import Question from "@/models/questionSchema";

export async function GET(request, { params }) {
  const { examId } = params; // dynamic route se examId mil jayega

  try {
    await connectMongoDB();

    const questions = await Question.find({ examId });

    return new Response(
      JSON.stringify({
        success: true,
        count: questions.length,
        data: questions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
