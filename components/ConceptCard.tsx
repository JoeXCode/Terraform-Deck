import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function ConceptCard({
  icon: Icon,
  name,
  badge,
  code,
  text,
  items,
  accent,
  footer,
  children,
  compact = false,
}: {
  icon?: LucideIcon;
  name: string;
  badge?: string;
  code?: string;
  text?: string;
  items?: string[];
  accent: string;
  footer?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`flex h-full flex-col justify-between rounded-xl border border-line bg-panel ${compact ? "p-4.5" : "p-6"}`}>
      <div>
        <div className="flex items-center justify-between">
          {Icon && <Icon size={compact ? 28 : 36} color={accent} />}
          {badge && (
            <span
              className={`rounded-md font-mono font-semibold uppercase tracking-wider ${
                compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
              }`}
              style={{ background: accent + "22", color: accent, border: `1px solid ${accent}44` }}
            >
              {badge}
            </span>
          )}
        </div>
        <h3 className={`font-semibold ${compact ? "mt-3 text-2xl" : "mt-4 text-3xl"}`}>{name}</h3>
        {code && (
          <pre className={`overflow-x-auto rounded-lg bg-bg font-mono leading-snug text-ink border border-line/60 ${
            compact ? "mt-2 p-2.5 text-base" : "mt-3 p-3 text-lg"
          }`}>
            <code>{code}</code>
          </pre>
        )}
        {text && <p className={`leading-snug text-mute ${compact ? "mt-2 text-base" : "mt-3 text-xl"}`}>{text}</p>}
        {items && (
          <ul className={`leading-snug ${compact ? "mt-2.5 space-y-1.5 text-base" : "mt-3.5 space-y-2 text-lg"}`}>
            {items.map((i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
      {footer && (
        <div className={`border-t border-line/60 font-mono text-mute ${compact ? "mt-3 pt-2 text-xs" : "mt-4 pt-2.5 text-sm"}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
