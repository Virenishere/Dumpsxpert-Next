import {connectMongoDB} from '@/lib/mongo';
import Question from '@/models/questionSchema';

export async function GET(request, { params }) {
  await connectMongoDB();
  try {
    const question = await Question.findById(params.id);
    if (!question) {
      return new Response(JSON.stringify({ error: 'Question not found' }), {
        status: 404
      });
    }
    return new Response(JSON.stringify(question), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500
    });
  }
}

export async function PUT(request, { params }) {
  await connectMongoDB();
  try {
    const data = await request.json();
    const updatedQuestion = await Question.findByIdAndUpdate(params.id, data, { new: true });
    return new Response(JSON.stringify(updatedQuestion), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update question' }), {
      status: 500
    });
  }
}

export async function DELETE(request, { params }) {
  await connectMongoDB();
  try {
    await Question.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: 'Question deleted successfully' }), {
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete question' }), {
      status: 500
    });
  }
}