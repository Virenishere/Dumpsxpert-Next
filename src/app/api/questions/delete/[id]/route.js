import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { connectMongoDB } from '@/lib/mongo';
import Question from '@/models/questionSchema';

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Unauthorized: Admin access required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectMongoDB();
    const deleted = await Question.findByIdAndDelete(params.id);

    if (!deleted) {
      return new Response(JSON.stringify({ message: 'Question not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Question deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error deleting question:', err.message);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}