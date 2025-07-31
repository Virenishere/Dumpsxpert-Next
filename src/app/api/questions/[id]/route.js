import { connectMongoDB } from '@/lib/mongo';
import Question from '@/models/questionSchema';

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const question = await Question.findById(params.id);
    if (!question) {
      return new Response(JSON.stringify({ message: 'Question not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(question), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error fetching question:', err.message);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}