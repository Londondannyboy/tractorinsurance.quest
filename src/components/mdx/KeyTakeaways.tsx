interface KeyTakeawaysProps {
  items: string[];
  title?: string;
}

export function KeyTakeaways({ items, title = 'Key Takeaways' }: KeyTakeawaysProps) {
  return (
    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 my-8">
      <h2 className="text-emerald-400 font-semibold text-lg mb-4 flex items-center gap-2">
        <span>📌</span> {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span className="text-slate-200 text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KeyTakeaways;
