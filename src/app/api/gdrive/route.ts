import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("folderId");

  if (!folderId) {
    return NextResponse.json({ success: false, error: "Missing folderId parameter" }, { status: 400 });
  }

  // 1. Try Google Drive API if API Key is configured in environment variables
  const apiKey = process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      console.log(`[GDrive API] Fetching folder ${folderId} using Google Drive API`);
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+startsWith+'image/'+and+trashed=false&key=${apiKey}&fields=files(id,name,mimeType)&pageSize=100`;
      
      const res = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60 seconds
      if (res.ok) {
        const data = await res.json();
        if (data.files && Array.from(data.files).length > 0) {
          const imageUrls = data.files.map((file: any) => `/api/gdrive/image?id=${file.id}&v=3`);
          return NextResponse.json({ success: true, images: imageUrls, source: "api" });
        }
      } else {
        console.warn(`[GDrive API] API response error: ${res.status}`);
      }
    } catch (err) {
      console.error("[GDrive API] Google Drive API failed:", err);
    }
  }

  // 2. Scraper Fallback: Fetch public folder HTML and parse file IDs using regex
  try {
    console.log(`[GDrive Scraper] Attempting to scrape public folder ${folderId}`);
    const folderUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
    
    const res = await fetch(folderUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to fetch Google Drive folder page. Status: ${res.status}. Please make sure the folder sharing settings are set to 'Anyone with the link can view'.`
      }, { status: 500 });
    }

    const html = await res.text();
    
    // Check if we hit the login screen or restricted access prompt
    if (html.includes('accounts.google.com/v3/signin') || html.includes('identifier') || html.includes('Sign in to your Google Account')) {
      return NextResponse.json({
        success: false,
        error: "Google Drive redirected to sign-in. This means the folder is restricted. Please share the folder as 'Anyone with the link can view' or use direct image links instead."
      });
    }

    const fileIds = new Set<string>();
    
    // 1. Entry-based parsing regex for embedded folderview: <div class="flip-entry" id="entry-[ID]">...<div class="flip-entry-title">[FILENAME]</div>
    const entryPattern = /id="entry-([a-zA-Z0-9_-]{19,80})"[^>]*>[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>/gi;
    let match;
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|heic|heif|svg)$/i;

    while ((match = entryPattern.exec(html)) !== null) {
      const fileId = match[1];
      const filename = match[2].trim();
      
      // Filter by image extension to prevent non-image files from being added
      if (imageExtensions.test(filename)) {
        if (fileId !== folderId) {
          fileIds.add(fileId);
        }
      }
    }

    // 2. Fallback: simple href /file/d/ID/view matcher if entry Pattern returns nothing
    if (fileIds.size === 0) {
      const hrefPattern = /\/file\/d\/([a-zA-Z0-9_-]{19,80})\/view/gi;
      let m;
      while ((m = hrefPattern.exec(html)) !== null) {
        const fileId = m[1];
        if (fileId !== folderId) {
          fileIds.add(fileId);
        }
      }
    }

    // 3. Fallback: generic 33-character ID regex as absolute fallback
    if (fileIds.size === 0) {
      const idPattern = /["'](1[a-zA-Z0-9_-]{32})["']/g;
      let m;
      while ((m = idPattern.exec(html)) !== null) {
        const fileId = m[1];
        if (fileId !== folderId) {
          fileIds.add(fileId);
        }
      }
    }

    if (fileIds.size > 0) {
      const imageUrls = Array.from(fileIds).map(id => `/api/gdrive/image?id=${id}&v=3`);
      console.log(`[GDrive Scraper] Successfully parsed ${imageUrls.length} images from folder ${folderId}`);
      return NextResponse.json({ success: true, images: imageUrls, source: "scraper" });
    }

    return NextResponse.json({ 
      success: false, 
      error: "No images found in the Google Drive folder. Make sure the folder contains public images and is shared with 'Anyone with the link'."
    });
  } catch (err: any) {
    console.error("[GDrive Scraper] Scraping failed:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
