import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { connectMongoDB } from '@/lib/mongo';
import Question from '@/models/questionSchema';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Unauthorized: Admin access required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectMongoDB();
    const updated = await Question.findByIdAndUpdate(params.id, await req.json(), {
      new: true,
    });

    if (!updated) {
      return new Response(JSON.stringify({ message: 'Question not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error updating question:', err.message);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}