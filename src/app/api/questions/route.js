import { connectMongoDB } from '@/lib/mongo';
import Question from '@/models/questionSchema';

export async function GET() {
  await connectMongoDB();
  try {
    const questions = await Question.find();
    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch questions' }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  await connectMongoDB();
  try {
    const data = await request.json();
    const question = new Question(data);
    await question.save();
    return new Response(JSON.stringify(question), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create question' }), {
      status: 500,
    });
  }
}
