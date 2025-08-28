import { connectMongoDB } from "@/lib/mongo";
import Question from "@/models/questionSchema";
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Add new question
export async function POST(request) {
  try {
    await connectMongoDB();
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    const { examId } = data;
    
    if (!examId) {
      return NextResponse.json(
        { success: false, message: "Exam ID is required" },
        { status: 400 }
      );
    }
    
    // Process options
    const options = JSON.parse(data.options || '[]');
    const correctAnswers = JSON.parse(data.correctAnswers || '[]');
    
    // Upload question image if exists
    const questionImageFile = formData.get('questionImage');
    let questionImageUrl = '';
    if (questionImageFile instanceof Blob && questionImageFile.size > 0) {
      questionImageUrl = await uploadImage(questionImageFile);
    }

    // Upload option images
    const processedOptions = await Promise.all(
      options.map(async (option, index) => {
        const optionImageFile = formData.get(`optionImage-${index}`);
        if (optionImageFile instanceof Blob && optionImageFile.size > 0) {
          option.image = await uploadImage(optionImageFile);
        }
        return option;
      })
    );

    // Create new question
    const newQuestion = await Question.create({
      ...data,
      examId,
      questionImage: questionImageUrl,
      options: processedOptions,
      correctAnswers,
      marks: Number(data.marks),
      negativeMarks: Number(data.negativeMarks),
      isSample: data.isSample === 'true',
    });

    return NextResponse.json(
      { success: true, data: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create question" },
      { status: 500 }
    );
  }
}

// Helper function to upload image to Cloudinary
async function uploadImage(imageFile) {
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}