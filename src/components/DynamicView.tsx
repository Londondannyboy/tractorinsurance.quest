'use client';

import { motion } from 'framer-motion';
import {
  ComparisonTable,
  CostChart,
  ProsCons,
  InfoCard,
  KPI,
  RelocationTimeline,
  ClimateChart,
  RestaurantGuide,
  QualityOfLifeRadar,
  PropertyPrices,
} from './mdx';

// Types for AI-generated views
export interface ViewBlock {
  type:
    | 'comparison'
    | 'cost_chart'
    | 'pros_cons'
    | 'info_card'
    | 'text'
    | 'heading'
    | 'kpi'
    | 'timeline'
    | 'climate'
    | 'restaurant'
    | 'quality_of_life'
    | 'section_header'
    | 'property';
  props: Record<string, unknown>;
}

export interface GeneratedView {
  title?: string;
  subtitle?: string;
  blocks: ViewBlock[];
}

interface DynamicViewProps {
  view: GeneratedView;
}

export function DynamicView({ view }: DynamicViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Title Section */}
      {view.title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">{view.title}</h2>
          {view.subtitle && (
            <p className="text-white/60 mt-1">{view.subtitle}</p>
          )}
        </div>
      )}

      {/* Render Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {view.blocks.map((block, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={getBlockColSpan(block.type)}
          >
            {renderBlock(block)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function getBlockColSpan(type: ViewBlock['type']): string {
  // Full-width blocks
  const fullWidthBlocks = [
    'comparison',
    'cost_chart',
    'pros_cons',
    'timeline',
    'section_header',
  ];

  // Half-width blocks
  const halfWidthBlocks = ['climate', 'restaurant', 'quality_of_life', 'property'];

  if (fullWidthBlocks.includes(type)) return 'lg:col-span-3';
  if (halfWidthBlocks.includes(type)) return 'lg:col-span-2 md:col-span-2';
  return 'lg:col-span-1';
}

function renderBlock(block: ViewBlock) {
  switch (block.type) {
    case 'kpi':
      return (
        <KPI
          label={block.props.label as string}
          value={block.props.value as string}
          icon={block.props.icon as string}
        />
      );

    case 'comparison':
      return (
        <ComparisonTable
          title={block.props.title as string}
          countries={block.props.countries as [string, string]}
          flags={block.props.flags as [string, string]}
          items={
            block.props.items as Array<{
              label: string;
              values: [string | number, string | number];
              highlight?: boolean;
              better?: 0 | 1;
            }>
          }
        />
      );

    case 'cost_chart':
      return (
        <CostChart
          title={block.props.title as string}
          items={
            block.props.items as Array<{
              label: string;
              amount: number;
              currency?: string;
              color?: string;
            }>
          }
          total={block.props.total as number}
          currency={block.props.currency as string}
          showPercentage={block.props.showPercentage as boolean}
        />
      );

    case 'pros_cons':
      return (
        <ProsCons
          title={block.props.title as string}
          pros={block.props.pros as string[]}
          cons={block.props.cons as string[]}
          country={block.props.country as string}
          flag={block.props.flag as string}
        />
      );

    case 'info_card':
      return (
        <InfoCard
          title={block.props.title as string}
          content={block.props.content as string}
          icon={block.props.icon as string}
          variant={
            block.props.variant as
              | 'default'
              | 'highlight'
              | 'warning'
              | 'success'
              | 'info'
          }
          items={block.props.items as Array<{ label: string; value: string }>}
        />
      );

    case 'timeline':
      return (
        <RelocationTimeline
          country={block.props.country as string}
          flag={block.props.flag as string}
          relocationType={
            block.props.relocationType as
              | 'digital_nomad'
              | 'hnwi'
              | 'company'
          }
          familyStatus={
            block.props.familyStatus as 'single' | 'with_family'
          }
        />
      );

    case 'climate':
      return (
        <ClimateChart
          type={block.props.type as string}
          annualSunshineHours={block.props.annualSunshineHours as number}
          seasons={
            block.props.seasons as Record<
              string,
              {
                months: string[];
                temp_avg_c: number;
                temp_min_c?: number;
                description: string;
              }
            >
          }
          bestMonths={block.props.bestMonths as string[]}
          rating={block.props.rating as number}
          humidity={block.props.humidity as number}
        />
      );

    case 'restaurant':
      return (
        <RestaurantGuide
          title={block.props.title as string}
          country={block.props.country as string}
          flag={block.props.flag as string}
          restaurants={
            block.props.restaurants as Array<{
              name: string;
              city: string;
              cuisine: string;
              price: string;
              michelin?: number;
            }>
          }
          signatureDishes={block.props.signatureDishes as string[]}
          michelinTotal={block.props.michelinTotal as number}
          avgCasual={block.props.avgCasual as number}
          avgFine={block.props.avgFine as number}
          currency={block.props.currency as string}
        />
      );

    case 'quality_of_life':
      return (
        <QualityOfLifeRadar
          title={block.props.title as string}
          country={block.props.country as string}
          flag={block.props.flag as string}
          metrics={
            block.props.metrics as Array<{
              label: string;
              value: number;
              maxValue?: number;
              icon?: string;
            }>
          }
          overallScore={block.props.overallScore as number}
        />
      );

    case 'section_header':
      return (
        <div className="py-4 border-b border-white/10">
          <h3 className="text-xl font-semibold text-amber-400">
            {block.props.icon ? <span className="mr-2">{String(block.props.icon)}</span> : null}
            {String(block.props.text)}
          </h3>
          {block.props.subtitle ? (
            <p className="text-sm text-white/60 mt-1">{String(block.props.subtitle)}</p>
          ) : null}
        </div>
      );

    case 'property':
      return (
        <PropertyPrices
          country={block.props.country as string}
          flag={block.props.flag as string}
          currency={block.props.currency as string}
          cities={
            block.props.cities as Array<{
              city: string;
              properties: Array<{
                type: string;
                avgPriceEur: number;
                pricePerSqm: number;
                rentalYield?: number;
              }>;
            }>
          }
          avgPricePerSqmNational={block.props.avgPricePerSqmNational as number}
          priceGrowthYoY={block.props.priceGrowthYoY as number}
          foreignOwnershipAllowed={block.props.foreignOwnershipAllowed as boolean}
          mortgageAvailable={block.props.mortgageAvailable as boolean}
          typicalDepositPercent={block.props.typicalDepositPercent as number}
        />
      );

    case 'heading':
      return (
        <h3 className="text-xl font-semibold text-amber-400">
          {block.props.text as string}
        </h3>
      );

    case 'text':
      return (
        <p className="text-white/70 leading-relaxed">
          {block.props.content as string}
        </p>
      );

    default:
      return null;
  }
}
