import { NextRequest, NextResponse } from 'next/server';
import { getAllBreeds, getBreedByName, searchBreeds } from '@/lib/tractor-db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const search = searchParams.get('search');

  try {
    if (name) {
      const breed = await getBreedByName(name);
      if (!breed) {
        return NextResponse.json({ error: 'Breed not found' }, { status: 404 });
      }
      return NextResponse.json(breed);
    }

    if (search) {
      const breeds = await searchBreeds(search);
      return NextResponse.json(breeds);
    }

    const breeds = await getAllBreeds();
    return NextResponse.json(breeds);
  } catch (error) {
    console.error('Error in breeds API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
