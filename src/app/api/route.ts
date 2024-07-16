import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");
  const imageUrl = searchParams.get("imageUrl");

  var targetUrl;
  if (!provider && imageUrl) {
    // return NextResponse.json(
    //   { error: "Missing provider or imageUrl" },
    //   { status: 400 }
    // );
    targetUrl = imageUrl;
  } else if ((!provider && !imageUrl) || (provider && !imageUrl)) {
    return NextResponse.json(
      { error: "Missing provider or Image URL" },
      { status: 400 }
    );
  } else {
    targetUrl = `https://manga-scrapers.onrender.com/${provider}/images/${imageUrl}`;
  }

  const response = await fetch(targetUrl!);
  const imageBuffer = await response.arrayBuffer();

  return new NextResponse(Buffer.from(imageBuffer), {
    headers: {
      "Content-Type": "image/jpeg", // Adjust the content type as needed
      "Cache-Control": "public, max-age=31536000, immutable", // Cache control headers
    },
  });
}
