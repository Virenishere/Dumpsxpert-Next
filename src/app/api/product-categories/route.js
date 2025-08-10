import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import ProductCategory from '@/models/productCategorySchema';
import { deleteFromCloudinary } from '@/utils/cloudinary';
import uploadMiddleware from '@/lib/multer';
import { promisify } from 'util';

const runMiddleware = promisify(uploadMiddleware.single('image'));

export async function GET() {
  await dbConnect();
  try {
    const categories = await ProductCategory.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();
  const name = formData.get('name');
  const status = formData.get('status') || 'Ready';
  const file = formData.get('image');

  if (!name || !file) {
    return NextResponse.json({ message: 'Name and image are required' }, { status: 400 });
  }

  // Handle Cloudinary upload here if needed, or handle manually in `uploadMiddleware`.

  const image = file.path;
  const public_id = file.filename;

  const newCategory = new ProductCategory({ name, status, image, public_id });
  const saved = await newCategory.save();
  return NextResponse.json(saved, { status: 201 });
}
