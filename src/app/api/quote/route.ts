import { NextRequest, NextResponse } from 'next/server';
import { getTractorTypeByName, calculateQuote, saveQuote, INSURANCE_PLANS } from '@/lib/tractor-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tractorTypeName, ageYears, planType, hasModifications, userId, sessionId } = body;

    if (!tractorTypeName || ageYears === undefined || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields: tractorTypeName, ageYears, planType' },
        { status: 400 }
      );
    }

    // Find the tractor type
    const tractorType = await getTractorTypeByName(tractorTypeName);
    if (!tractorType) {
      return NextResponse.json({ error: 'Tractor type not found' }, { status: 404 });
    }

    // Calculate quote
    const { monthlyPremium, annualPremium, plan } = calculateQuote(
      tractorType,
      ageYears,
      planType,
      hasModifications || false
    );

    // Save quote to database
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const quoteId = await saveQuote({
      user_id: userId,
      session_id: sessionId,
      tractor_details: {
        tractorType: tractorTypeName,
        age: ageYears,
        modifications: hasModifications ? ['Yes'] : undefined,
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
