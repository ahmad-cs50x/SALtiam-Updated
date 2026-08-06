import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';
import { promises as fs } from 'fs';
import path from 'path';

async function saveUploadedFile(file: any): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + '-' + file.name.replace(/\s+/g, '_');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return filename;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT /api/products called');
    await dbConnect();
    const { id } = await params;
    console.log('Product ID:', id);
    let updateData: any = {};
    // Support both JSON and multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      // Extract fields
      const name = formData.get('name')?.toString();
      if (name !== undefined) updateData.name = name;
      const description = formData.get('description')?.toString();
      if (description !== undefined) updateData.description = description;
      const category = formData.get('category')?.toString();
      if (category !== undefined) updateData.category = category;
      const availability = formData.get('availability')?.toString();
      if (availability !== undefined) updateData.availability = availability;
      const itemsSold = Number(formData.get('itemsSold') || 0);
      updateData.itemsSold = itemsSold;
      const isFeatured = formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on';
      updateData.isFeatured = isFeatured;
      // Handle images if any
      const images: string[] = [];
      for (const file of formData.getAll('images')) {
        if (file && typeof file === 'object' && 'arrayBuffer' in file && file.name) {
          images.push(await saveUploadedFile(file));
        } else if (typeof file === 'string') {
          images.push(file);
        }
      }
      if (images.length) updateData.images = images;
    } else {
      // Fallback to JSON body
      updateData = await req.json();
    }
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
