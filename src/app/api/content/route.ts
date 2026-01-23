import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/tractor-db';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const result = await getSql()`
      SELECT slug, title, description, keywords, content, meta
      FROM page_content
      WHERE slug = ${slug} AND published = true
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
