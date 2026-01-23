import { NextRequest, NextResponse } from 'next/server';
import { getBreedByName, calculateQuote, saveQuote, INSURANCE_PLANS } from '@/lib/tractor-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { breedName, ageYears, planType, hasPreexistingConditions, userId, sessionId } = body;

    if (!breedName || ageYears === undefined || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields: breedName, ageYears, planType' },
        { status: 400 }
      );
    }

    // Find the tractor type
    const tractorType = await getBreedByName(breedName);
    if (!tractorType) {
      return NextResponse.json({ error: 'Tractor type not found' }, { status: 404 });
    }

    // Calculate quote
    const { monthlyPremium, annualPremium, plan } = calculateQuote(
      tractorType,
      ageYears,
      planType,
      hasPreexistingConditions || false
    );

    // Save quote to database
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Quote valid for 30 days

    const quoteId = await saveQuote({
      user_id: userId,
      session_id: sessionId,
      dog_details: {
        breed: breedName,
        age: ageYears,
        preexisting_conditions: hasPreexistingConditions ? ['Yes'] : undefined,
      },
      plan_type: planType,
      quoted_premium: monthlyPremium,
      coverage_details: plan.coverage,
      valid_until: validUntil,
    });

    return NextResponse.json({
      quoteId,
      tractor: {
        name: tractorType.name,
        category: tractorType.size,
        riskCategory: tractorType.risk_category,
        commonRisks: tractorType.common_health_issues,
      },
      quote: {
        monthlyPremium,
        annualPremium,
        plan: {
          type: plan.type,
          name: plan.name,
          annualCoverageLimit: plan.annual_coverage_limit,
          deductible: plan.deductible,
          features: plan.features,
        },
        validUntil,
      },
    });
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // Return available plans
  return NextResponse.json({
    plans: INSURANCE_PLANS.map(plan => ({
      type: plan.type,
      name: plan.name,
      baseMonthlyPremium: plan.base_monthly_premium,
      annualCoverageLimit: plan.annual_coverage_limit,
      deductible: plan.deductible,
      features: plan.features,
    })),
  });
}
