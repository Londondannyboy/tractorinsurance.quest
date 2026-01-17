'use client';

import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: T[keyof T]) => ReactNode;
  highlight?: boolean;
  width?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  caption?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
  sortable?: boolean;
  onRowClick?: (row: T, index: number) => void;
}

function formatValue(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-slate-500">-</span>;
  }
  if (typeof value === 'boolean') {
    return value ? (
      <span className="text-emerald-400 font-medium">Yes</span>
    ) : (
      <span className="text-red-400">No</span>
    );
  }
  if (typeof value === 'number') {
    // Format currency if it looks like money
    if (value >= 1000) {
      return value.toLocaleString('en-GB');
    }
    return value.toString();
  }
  return String(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  caption,
  striped = true,
  hoverable = true,
  compact = false,
  stickyHeader = false,
  maxHeight,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div className="my-6">
      {title && (
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      )}

      <div
        className={`overflow-x-auto rounded-xl border border-slate-700/50 ${
          maxHeight ? 'overflow-y-auto' : ''
        }`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="w-full border-collapse">
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="bg-slate-800/90 backdrop-blur-sm">
              {columns.map((col, i) => (
                <th
                  key={String(col.key)}
                  className={`${cellPadding} ${alignmentClasses[col.align || 'left']}
                    font-semibold text-slate-300 border-b border-slate-700/50
                    ${col.highlight ? 'bg-emerald-900/30 text-emerald-400' : ''}
                    ${i === 0 ? 'rounded-tl-xl' : ''}
                    ${i === columns.length - 1 ? 'rounded-tr-xl' : ''}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`${cellPadding} text-center text-slate-500 italic`}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    ${striped && rowIndex % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'}
                    ${hoverable ? 'hover:bg-slate-700/50 transition-colors' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`${cellPadding} ${alignmentClasses[col.align || 'left']}
                        text-slate-200 text-sm border-b border-slate-700/30
                        ${col.highlight ? 'bg-emerald-900/10' : ''}`}
                    >
                      {col.format
                        ? col.format(row[col.key])
                        : formatValue(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {caption && (
        <p className="text-slate-500 text-xs mt-2 italic">{caption}</p>
      )}
    </div>
  );
}

// Pre-configured variants for common pension data
interface PensionRateRow {
  year: string;
  weekly: string;
  annual: string;
  increase?: string;
}

export function StatePensionRatesTable({ data, title = 'State Pension Rates' }: { data: PensionRateRow[]; title?: string }) {
  return (
    <DataTable
      title={title}
      data={data}
      columns={[
        { key: 'year', header: 'Year', width: '100px' },
        { key: 'weekly', header: 'Weekly', align: 'right' },
        { key: 'annual', header: 'Annual', align: 'right', highlight: true },
        { key: 'increase', header: 'Increase', align: 'right' },
      ]}
    />
  );
}

interface ContributionRow {
  band: string;
  employee: string;
  employer: string;
  total: string;
}

export function ContributionRatesTable({ data, title = 'Contribution Rates' }: { data: ContributionRow[]; title?: string }) {
  return (
    <DataTable
      title={title}
      data={data}
      columns={[
        { key: 'band', header: 'Earnings Band' },
        { key: 'employee', header: 'Employee', align: 'right' },
        { key: 'employer', header: 'Employer', align: 'right' },
        { key: 'total', header: 'Total', align: 'right', highlight: true },
      ]}
    />
  );
}

export default DataTable;
