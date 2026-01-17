'use client';

// Simple chart components for pension data visualization
// These are designed to work with CopilotKit rendering

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  subtitle?: string;
  showValues?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  maxValue?: number;
  height?: number;
}

export function BarChart({
  data,
  title,
  subtitle,
  showValues = true,
  valuePrefix = '',
  valueSuffix = '',
  maxValue,
  height = 300,
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value)) * 1.1;

  return (
    <div className="my-6">
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
      )}

      <div
        className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6"
        style={{ height }}
      >
        <div className="flex items-end justify-around h-full gap-2">
          {data.map((item, i) => {
            const barHeight = (item.value / max) * 100;
            const color = item.color || 'bg-emerald-500';

            return (
              <div key={i} className="flex flex-col items-center flex-1 h-full">
                <div className="flex-1 w-full flex items-end justify-center">
                  <div
                    className={`w-full max-w-16 ${color} rounded-t-lg transition-all duration-500 ease-out relative group`}
                    style={{ height: `${barHeight}%` }}
                  >
                    {showValues && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white text-sm font-medium whitespace-nowrap">
                        {valuePrefix}
                        {item.value.toLocaleString('en-GB')}
                        {valueSuffix}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-slate-400 text-xs mt-3 text-center truncate w-full px-1">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  data,
  title,
  subtitle,
  showLegend = true,
  size = 200,
  thickness = 40,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="my-6">
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Chart */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              {data.map((item, i) => {
                const percentage = item.value / total;
                const strokeLength = circumference * percentage;
                const offset = currentOffset;
                currentOffset += strokeLength;

                return (
                  <circle
                    key={i}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={thickness}
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Center text */}
            {(centerLabel || centerValue) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {centerValue && (
                  <span className="text-2xl font-bold text-white">{centerValue}</span>
                )}
                {centerLabel && (
                  <span className="text-sm text-slate-400">{centerLabel}</span>
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="flex flex-col gap-3">
              {data.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="text-white text-sm">{item.label}</span>
                    <span className="text-slate-400 text-sm ml-2">
                      ({((item.value / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  subtitle?: string;
  color?: string;
  showArea?: boolean;
  showDots?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  height?: number;
}

export function LineChart({
  data,
  title,
  subtitle,
  color = '#10b981',
  showArea = true,
  showDots = true,
  height = 250,
}: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;
  const minValue = Math.min(...data.map((d) => d.value)) * 0.9;
  const range = maxValue - minValue;

  const padding = { top: 20, right: 20, bottom: 40, left: 20 };
  const chartWidth = 100 - padding.left - padding.right;
  const chartHeight = 100 - padding.top - padding.bottom;

  const points = data.map((item, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + ((maxValue - item.value) / range) * chartHeight;
    return { x, y, ...item };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div className="my-6">
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
      )}

      <div
        className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6"
        style={{ height }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <line
              key={pct}
              x1={padding.left}
              y1={padding.top + (chartHeight * pct) / 100}
              x2={padding.left + chartWidth}
              y2={padding.top + (chartHeight * pct) / 100}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={0.2}
            />
          ))}

          {/* Area fill */}
          {showArea && (
            <path d={areaPath} fill={color} fillOpacity={0.2} />
          )}

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={0.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {showDots &&
            points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={1.2}
                fill={color}
                className="hover:r-2 transition-all"
              />
            ))}

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={95}
              fill="currentColor"
              fillOpacity={0.5}
              fontSize={3}
              textAnchor="middle"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// Stat card for single values
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'violet';
}

const colorStyles = {
  emerald: 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400',
  blue: 'bg-blue-900/30 border-blue-500/30 text-blue-400',
  amber: 'bg-amber-900/30 border-amber-500/30 text-amber-400',
  red: 'bg-red-900/30 border-red-500/30 text-red-400',
  violet: 'bg-violet-900/30 border-violet-500/30 text-violet-400',
};

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'emerald',
}: StatCardProps) {
  const changeColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
  };

  return (
    <div className={`rounded-xl border p-5 ${colorStyles[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {change && (
        <div className={`text-sm ${changeColors[changeType]}`}>{change}</div>
      )}
    </div>
  );
}

// Grid wrapper for stat cards
interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4 my-6`}>
      {children}
    </div>
  );
}

export default BarChart;
