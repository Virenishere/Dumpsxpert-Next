'use client';
import { useParams } from 'next/navigation';
import ProductForm from '../../ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  if (!id) {
    return <div className="text-center py-10">Loading product data...</div>;
  }

  return <ProductForm mode="edit" />;
}