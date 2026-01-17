'use client';

import { useCopilotAction } from '@copilotkit/react-core';
import { BarChart, DonutChart, LineChart, StatCard, StatGrid } from '@/components/mdx/PensionChart';
import { DataTable } from '@/components/mdx/DataTable';

/**
 * CopilotKit Chart Actions
 *
 * This component registers CopilotKit actions that allow the AI assistant
 * to render charts, graphs, and data visualizations in the sidebar panel.
 *
 * Usage: Add <CopilotChartActions /> to any page where you want the AI
 * to be able to render visualizations.
 */
export function CopilotChartActions() {
  // Action: Render a bar chart
  useCopilotAction({
    name: "render_bar_chart",
    description: "Display a bar chart visualization for comparing pension values",
    parameters: [
      { name: "title", type: "string" as const, description: "Chart title" },
      { name: "subtitle", type: "string" as const, description: "Chart subtitle (optional)" },
      { name: "data", type: "string" as const, description: "JSON array of {label, value, color?} objects" },
      { name: "valuePrefix", type: "string" as const, description: "Prefix for values (e.g., £)" },
    ],
    render: ({ status, args }) => {
      if (status === 'inProgress') {
        return <ChartLoading />;
      }

      try {
        const data = JSON.parse(args.data || '[]');
        return (
          <BarChart
            title={args.title}
            subtitle={args.subtitle}
            data={data}
            valuePrefix={args.valuePrefix || ''}
            height={250}
          />
        );
      } catch {
        return <ChartError message="Failed to render bar chart" />;
      }
    },
    handler: async ({ title, data }) => {
      return `Rendered bar chart: ${title} with ${JSON.parse(data).length} data points`;
    },
  });

  // Action: Render a donut chart
  useCopilotAction({
    name: "render_donut_chart",
    description: "Display a donut/pie chart for showing pension breakdowns and proportions",
    parameters: [
      { name: "title", type: "string" as const, description: "Chart title" },
      { name: "data", type: "string" as const, description: "JSON array of {label, value, color} objects" },
      { name: "centerLabel", type: "string" as const, description: "Label in center of donut (optional)" },
      { name: "centerValue", type: "string" as const, description: "Value in center of donut (optional)" },
    ],
    render: ({ status, args }) => {
      if (status === 'inProgress') {
        return <ChartLoading />;
      }

      try {
        const data = JSON.parse(args.data || '[]');
        return (
          <DonutChart
            title={args.title}
            data={data}
            centerLabel={args.centerLabel}
            centerValue={args.centerValue}
            size={180}
          />
        );
      } catch {
        return <ChartError message="Failed to render donut chart" />;
      }
    },
    handler: async ({ title }) => {
      return `Rendered donut chart: ${title}`;
    },
  });

  // Action: Render a line chart
  useCopilotAction({
    name: "render_line_chart",
    description: "Display a line chart for showing pension growth over time",
    parameters: [
      { name: "title", type: "string" as const, description: "Chart title" },
      { name: "subtitle", type: "string" as const, description: "Chart subtitle (optional)" },
      { name: "data", type: "string" as const, description: "JSON array of {label, value} objects" },
      { name: "color", type: "string" as const, description: "Line color (hex code, optional)" },
    ],
    render: ({ status, args }) => {
      if (status === 'inProgress') {
        return <ChartLoading />;
      }

      try {
        const data = JSON.parse(args.data || '[]');
        return (
          <LineChart
            title={args.title}
            subtitle={args.subtitle}
            data={data}
            color={args.color || '#10b981'}
            height={200}
          />
        );
      } catch {
        return <ChartError message="Failed to render line chart" />;
      }
    },
    handler: async ({ title }) => {
      return `Rendered line chart: ${title}`;
    },
  });

  // Action: Render stat cards
  useCopilotAction({
    name: "render_stat_cards",
    description: "Display a grid of statistic cards showing key pension figures",
    parameters: [
      { name: "stats", type: "string" as const, description: "JSON array of {label, value, change?, changeType?, icon?, color?} objects" },
    ],
    render: ({ status, args }) => {
      if (status === 'inProgress') {
        return <ChartLoading />;
      }

      try {
        const stats = JSON.parse(args.stats || '[]');
        return (
          <StatGrid columns={stats.length <= 2 ? 2 : stats.length <= 3 ? 3 : 4}>
            {stats.map((stat: {
              label: string;
              value: string | number;
              change?: string;
              changeType?: 'positive' | 'negative' | 'neutral';
              icon?: string;
              color?: 'emerald' | 'blue' | 'amber' | 'red' | 'violet';
            }, i: number) => (
              <StatCard
                key={i}
                label={stat.label}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </StatGrid>
        );
      } catch {
        return <ChartError message="Failed to render stat cards" />;
      }
    },
    handler: async ({ stats }) => {
      return `Rendered ${JSON.parse(stats).length} stat cards`;
    },
  });

  // Action: Render a data table
  useCopilotAction({
    name: "render_data_table",
    description: "Display a data table with pension information",
    parameters: [
      { name: "title", type: "string" as const, description: "Table title" },
      { name: "columns", type: "string" as const, description: "JSON array of {key, header, align?} objects" },
      { name: "data", type: "string" as const, description: "JSON array of row objects" },
      { name: "caption", type: "string" as const, description: "Table caption/footnote (optional)" },
    ],
    render: ({ status, args }) => {
      if (status === 'inProgress') {
        return <ChartLoading />;
      }

      try {
        const columns = JSON.parse(args.columns || '[]');
        const data = JSON.parse(args.data || '[]');
        return (
          <DataTable
            title={args.title}
            columns={columns}
            data={data}
            caption={args.caption}
          />
        );
      } catch {
        return <ChartError message="Failed to render data table" />;
      }
    },
    handler: async ({ title, data }) => {
      return `Rendered table: ${title} with ${JSON.parse(data).length} rows`;
    },
  });

  // Action: Show pension calculation result
  useCopilotAction({
    name: "show_calculation_result",
    description: "Display a calculation result with a prominent value",
    parameters: [
      { name: "label", type: "string" as const, description: "What was calculated" },
      { name: "value", type: "string" as const, description: "The calculated value" },
      { name: "details", type: "string" as const, description: "Additional details or breakdown (optional)" },
    ],
    render: ({ status, args }) => {
      if (status === 'inProgress') {
        return <ChartLoading />;
      }

      return (
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-6 text-center my-4">
          <p className="text-slate-400 text-sm mb-2">{args.label}</p>
          <p className="text-4xl font-bold text-emerald-400 mb-3">{args.value}</p>
          {args.details && (
            <p className="text-slate-300 text-sm">{args.details}</p>
          )}
        </div>
      );
    },
    handler: async ({ label, value }) => {
      return `Calculation result: ${label} = ${value}`;
    },
  });

  // This component doesn't render anything visible
  return null;
}

// Helper components
function ChartLoading() {
  return (
    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 animate-pulse my-4">
      <div className="h-4 bg-slate-700 rounded w-1/3 mb-3"></div>
      <div className="h-32 bg-slate-700 rounded"></div>
    </div>
  );
}

function ChartError({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl my-4">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}

export default CopilotChartActions;
