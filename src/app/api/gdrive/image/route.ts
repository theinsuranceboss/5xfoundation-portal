import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing image id", { status: 400 });
  }

  try {
    // lh3 googleusercontent is stable on the server side
    const googleUrl = `https://lh3.googleusercontent.com/d/${id}=w1600`;
    console.log(`[GDrive Image Proxy] Fetching Google Drive image ${id} from: ${googleUrl}`);

    const res = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`[GDrive Image Proxy] Google returned status ${res.status} for ID ${id}`);
      return new Response(`Failed to fetch image from Google Drive: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    // Cache the image for 1 year (immutable) on browser ONLY, bypass CDN shared caching
    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error(`[GDrive Image Proxy] Internal error for ID ${id}:`, err);
    return new Response(`Internal server error: ${err.message}`, { status: 500 });
  }
}
