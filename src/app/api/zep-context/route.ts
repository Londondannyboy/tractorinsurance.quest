import { NextRequest, NextResponse } from 'next/server';

const ZEP_API_KEY = process.env.ZEP_API_KEY || '';

// Categorize a fact into tractor insurance ontological type
function categorize(fact: string): 'tractor_type' | 'tractor_name' | 'tractor_age' | 'condition' | 'insurance' | 'fact' {
  const lower = fact.toLowerCase();

  // Tractor type keywords
  if (['farm tractor', 'vintage tractor', 'compact tractor', 'utility tractor', 'mini tractor', 'garden tractor', 'ride-on', 'mower', 'john deere', 'massey ferguson', 'kubota', 'new holland', 'fordson', 'tractor type'].some(k => lower.includes(k))) {
    return 'tractor_type';
  }
  // Tractor name/identifier keywords
  if (['named', "tractor's name", 'called', 'my tractor', 'registration'].some(k => lower.includes(k))) {
    return 'tractor_name';
  }
  // Age keywords
  if (['year old', 'years old', 'new tractor', 'vintage', 'age', 'manufactured'].some(k => lower.includes(k))) {
    return 'tractor_age';
  }
  // Condition keywords
  if (['condition', 'repair', 'damage', 'breakdown', 'engine', 'hydraulic', 'mechanical', 'maintenance'].some(k => lower.includes(k))) {
    return 'condition';
  }
  // Insurance keywords
  if (['plan', 'coverage', 'premium', 'quote', 'basic', 'standard', 'comprehensive', 'deductible'].some(k => lower.includes(k))) {
    return 'insurance';
  }
  return 'fact';
}

// Clean up fact text for display
function cleanFact(fact: string): string {
  return fact
    .replace(/^(the user |user |they |he |she |their tractor )/i, '')
    .replace(/^(is |are |has |have |wants |prefers )/i, '')
    .trim();
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId || !ZEP_API_KEY) {
    return NextResponse.json({
      context: '',
      facts: [],
      entities: { types: [], names: [], ages: [], conditions: [], insurance: [] }
    });
  }

  try {
    // Use tractorinsurance prefix for Zep user ID
    const zepUserId = `tractorinsurance_${userId}`;

    // Fetch user's memory from Zep knowledge graph
    const response = await fetch('https://api.getzep.com/api/v2/graph/search', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${ZEP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: zepUserId,
        query: 'tractor type name age condition insurance plan coverage preferences',
        limit: 15,
        scope: 'edges',
      }),
    });

    if (!response.ok) {
      console.error('[Zep] Graph search failed:', response.status);
      return NextResponse.json({
        context: '',
        facts: [],
        entities: { types: [], names: [], ages: [], conditions: [], insurance: [] }
      });
    }

    const data = await response.json();
    const edges = data.edges || [];

    // Extract and categorize facts
    const categorizedFacts: Array<{ fact: string; type: string; clean: string }> = [];
    const entities = {
      types: [] as string[],
      names: [] as string[],
      ages: [] as string[],
      conditions: [] as string[],
      insurance: [] as string[],
    };

    for (const edge of edges) {
      if (!edge.fact) continue;

      const type = categorize(edge.fact);
      const clean = cleanFact(edge.fact);

      categorizedFacts.push({ fact: edge.fact, type, clean });

      // Collect unique entities by type
      if (type === 'tractor_type' && !entities.types.includes(clean)) {
        entities.types.push(clean);
      } else if (type === 'tractor_name' && !entities.names.includes(clean)) {
        entities.names.push(clean);
      } else if (type === 'tractor_age' && !entities.ages.includes(clean)) {
        entities.ages.push(clean);
      } else if (type === 'condition' && !entities.conditions.includes(clean)) {
        entities.conditions.push(clean);
      } else if (type === 'insurance' && !entities.insurance.includes(clean)) {
        entities.insurance.push(clean);
      }
    }

    // Build context string grouped by type
    const contextParts: string[] = [];

    if (entities.types.length) {
      contextParts.push(`Tractor Type: ${entities.types.join(', ')}`);
    }
    if (entities.names.length) {
      contextParts.push(`Tractor Name: ${entities.names.join(', ')}`);
    }
    if (entities.ages.length) {
      contextParts.push(`Tractor Age: ${entities.ages.join(', ')}`);
    }
    if (entities.conditions.length) {
      contextParts.push(`Condition Notes: ${entities.conditions.join(', ')}`);
    }
    if (entities.insurance.length) {
      contextParts.push(`Insurance Interest: ${entities.insurance.join(', ')}`);
    }

    const context = contextParts.length > 0
      ? contextParts.join('\n')
      : '';

    return NextResponse.json({
      context,
      facts: categorizedFacts,
      entities,
    });
  } catch (error) {
    console.error('[Zep] Error:', error);
    return NextResponse.json({
      context: '',
      facts: [],
      entities: { types: [], names: [], ages: [], conditions: [], insurance: [] }
    });
  }
}
