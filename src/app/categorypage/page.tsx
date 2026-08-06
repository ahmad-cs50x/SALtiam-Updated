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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const contentType = req.headers.get('content-type') || '';
    let name = '';
    let description = '';
    let category = 'food-salt';
    let availability = 'In Stock';
    let itemsSold = 0;
    let isFeatured = false;
    const images: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = formData.get('name')?.toString() || '';
      description = formData.get('description')?.toString() || '';
      category = formData.get('category')?.toString() || 'food-salt';
      availability = formData.get('availability')?.toString() || 'In Stock';
      itemsSold = Number(formData.get('itemsSold') || 0);
      isFeatured = formData.get('isFeatured') === 'true' || formData.get('isFeatured') === 'on';
      for (const file of formData.getAll('images')) {
        if (file && typeof file === 'object' && 'arrayBuffer' in file && file.name) {
          images.push(await saveUploadedFile(file));
        } else if (typeof file === 'string' && file.trim()) {
          images.push(file);
        }
      }
    } else {
      const body = await req.json();
      name = body.name || '';
      description = body.description || '';
      category = body.category || 'food-salt';
      availability = body.availability || 'In Stock';
      itemsSold = Number(body.itemsSold || 0);
      isFeatured = body.isFeatured === true || body.isFeatured === 'true' || body.isFeatured === 'on';
      if (Array.isArray(body.images)) {
        images.push(...body.images);
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      availability,
      itemsSold,
      isFeatured,
      images
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
