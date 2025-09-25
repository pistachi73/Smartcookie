import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getLocale } from "next-intl/server";
import ogs from "open-graph-scraper";

/**
 * Fetches metadata from a URL
 * This acts as a CORS proxy to avoid browser CORS issues
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const locale = await getLocale();

  if (!url) {
    return NextResponse.json(null, { status: 400 });
  }

  try {
    const data = await ogs({
      url,
      fetchOptions: {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": locale,
          "Accept-Encoding": "gzip, deflate, br",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      },
    });
    if (!data || data?.error) return NextResponse.json({});

    const metadata = {
      title: data.result.ogTitle,
      description: data.result.ogDescription,
      logo: data.result.favicon,
      url: data.result.ogUrl || data.result.requestUrl,
    };
    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json({});
  }
}
