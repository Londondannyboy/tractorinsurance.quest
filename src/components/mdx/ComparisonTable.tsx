interface Column {
  key: string;
  header: string;
  highlight?: boolean;
}

interface Row {
  feature: string;
  values: Record<string, string | number | boolean>;
  tooltip?: string;
}

interface ComparisonTableProps {
  title?: string;
  columns: Column[];
  rows: Row[];
  footnote?: string;
}

export function ComparisonTable({ title, columns, rows, footnote }: ComparisonTableProps) {
  const renderValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-emerald-400">✓</span>
      ) : (
        <span className="text-red-400">✗</span>
      );
    }
    return value;
  };

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/80">
              <th className="text-left p-4 text-slate-300 font-medium border-b border-slate-700/50">
                Feature
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-center p-4 font-medium border-b border-slate-700/50 ${
                    col.highlight ? 'text-emerald-400 bg-emerald-900/20' : 'text-slate-300'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'
                } hover:bg-slate-800/70 transition-colors`}
              >
                <td className="p-4 text-white text-sm border-b border-slate-700/30">
                  {row.feature}
                  {row.tooltip && (
                    <span className="ml-1 text-slate-500 cursor-help" title={row.tooltip}>
                      ⓘ
                    </span>
                  )}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`text-center p-4 text-sm border-b border-slate-700/30 ${
                      col.highlight ? 'bg-emerald-900/10' : ''
                    }`}
                  >
                    <span className="text-slate-200">
                      {renderValue(row.values[col.key])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote && (
        <p className="text-slate-500 text-xs mt-3 italic">{footnote}</p>
      )}
    </div>
  );
}

export default ComparisonTable;
