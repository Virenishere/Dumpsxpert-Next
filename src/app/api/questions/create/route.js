import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { connectMongoDB } from '@/lib/mongo';
import mongoose from 'mongoose';
import Question from '@/models/questionSchema';

const generateQuestionCode = async () => {
  await connectMongoDB();
  const count = await Question.countDocuments();
  return `Q-${String(count + 1).padStart(3, '0')}`;
};

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Unauthorized: Admin access required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { examId, ...body } = await req.json();

    if (!examId) {
      return new Response(JSON.stringify({ message: 'examId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectMongoDB();
    const questionCode = await generateQuestionCode();

    const question = new Question({
      ...body,
      examId: new mongoose.Types.ObjectId(examId),
      questionCode,
    });

    const saved = await question.save();
    return new Response(JSON.stringify(saved), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error creating question:', err.message);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      });
  }
}