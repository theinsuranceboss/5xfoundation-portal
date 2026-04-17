import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save directly to public/ to overwrite core assets instantly
    const uploadDir = path.join(process.cwd(), 'public');
    
    // Core assets mapping
    const fileName = name || file.name;
    const filePath = path.join(uploadDir, fileName);
    
    // Log the action for debug
    console.log(`Overwriting asset: ${filePath}`);
    
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/${fileName}?t=${Date.now()}` // Add timestamp to bust cache
    });
  } catch (error) {
    console.error("Upload failure:", error);
    return NextResponse.json({ error: "System failed to write file to disk." }, { status: 500 });
  }
}
