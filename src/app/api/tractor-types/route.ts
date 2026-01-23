import { NextRequest, NextResponse } from 'next/server';
import { getAllTractorTypes, getTractorTypeByName, searchTractorTypes } from '@/lib/tractor-db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const search = searchParams.get('search');

  try {
    if (name) {
      const tractorType = await getTractorTypeByName(name);
      if (!tractorType) {
        return NextResponse.json({ error: 'Tractor type not found' }, { status: 404 });
      }
      return NextResponse.json(tractorType);
    }

    if (search) {
      const types = await searchTractorTypes(search);
      return NextResponse.json(types);
    }

    const types = await getAllTractorTypes();
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error in tractor types API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
