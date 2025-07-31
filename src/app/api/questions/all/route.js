import { connectMongoDB } from '@/lib/mongo';
import Question from '@/models/questionSchema';

export async function GET() {
  try {
    await connectMongoDB();
    const questions = await Question.find();
    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error fetching questions:', err.message);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}