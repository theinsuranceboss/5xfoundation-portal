import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import { supabase } from '@/lib/supabase';

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

    const baseName = name || file.name;
    const sanitizedName = baseName.replace(/\s+/g, '_');
    const uniqueFileName = `${Date.now()}-${sanitizedName}`;

    console.log(`Attempting to upload dynamic asset: ${uniqueFileName} to Supabase Storage...`);

    // 1. Try to upload to Supabase Storage bucket '5x_assets'
    try {
      // First, try upload
      const { data, error: uploadError } = await supabase.storage
        .from('5x_assets')
        .upload(uniqueFileName, buffer, {
          contentType: file.type || 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.warn("Supabase upload failed directly, attempting to create bucket first:", uploadError.message);
        
        // Try creating the bucket in case it doesn't exist
        await supabase.storage.createBucket('5x_assets', { public: true });
        
        // Re-attempt upload after bucket creation
        const { data: retryData, error: retryError } = await supabase.storage
          .from('5x_assets')
          .upload(uniqueFileName, buffer, {
            contentType: file.type || 'image/png',
            upsert: true
          });

        if (retryError) {
          throw retryError;
        }
      }

      // If successful, get the public CDN URL
      const { data: { publicUrl } } = supabase.storage
        .from('5x_assets')
        .getPublicUrl(uniqueFileName);

      console.log(`Successfully uploaded to Supabase Storage. Public URL: ${publicUrl}`);
      return NextResponse.json({
        success: true,
        url: publicUrl
      });

    } catch (storageError: any) {
      console.error("Supabase Storage upload failed, failing over to local filesystem:", storageError?.message || storageError);
      
      // 2. Local Fallback - Save to public/ to overwrite core assets instantly for local development
      const uploadDir = path.join(process.cwd(), 'public');
      const filePath = path.join(uploadDir, sanitizedName);
      
      console.log(`Failing over: Overwriting local asset: ${filePath}`);
      await writeFile(filePath, buffer);

      return NextResponse.json({ 
        success: true, 
        url: `/${sanitizedName}?t=${Date.now()}` // Add timestamp to bust cache
      });
    }
  } catch (error) {
    console.error("Upload failure:", error);
    return NextResponse.json({ error: "System failed to write file." }, { status: 500 });
  }
}

