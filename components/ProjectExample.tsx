import type { ReactNode } from "react";
import { Server, ShieldCheck, Database, Layers } from "lucide-react";

interface ProjectExampleProps {
  title?: string;
  subtitle?: string;
  what?: string;
  code?: string;
  points?: string[];
  tags?: string[];
  accent?: string;
  children?: ReactNode;
  compact?: boolean;
}

/** Real reference-project spotlight: Task Tracker & CloudCommerce infrastructure. */
export function ProjectExample({
  title = "In Our Project: AWS Fargate & RDS Stack",
  subtitle = "Group 1b Scale-it / CloudCommerce Production Stack",
  what,
  code,
  points,
  tags = ["AWS ECS Fargate", "PostgreSQL RDS", "ALB", "S3 + DynamoDB"],
  accent = "#FF9900",
  children,
  compact = false,
}: ProjectExampleProps) {
  return (
    <div
      className={`w-full rounded-xl border bg-panel ${compact ? "p-4" : "p-5"}`}
      style={{
        borderColor: accent + "66",
        background: `linear-gradient(135deg, ${accent}0D 0%, #121923 100%)`,
        boxShadow: `inset 4px 0 0 ${accent}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider"
            style={{ background: accent + "22", color: accent }}
          >
            <Server size={14} />
            Real Project Implementation
          </span>
          <span className="font-mono text-sm text-mute/80">{subtitle}</span>
        </div>
        {tags && (
          <div className="flex items-center gap-1.5">
            {tags.map((t) => (
              <span key={t} className="rounded-md border border-line bg-bg px-2 py-0.5 font-mono text-xs text-mute">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={compact ? "mt-2" : "mt-3"}>
        <h4 className={`font-semibold text-ink ${compact ? "text-xl" : "text-2xl"}`}>{title}</h4>
        {what && <p className={`leading-snug text-ink/90 ${compact ? "mt-1 text-base" : "mt-1.5 text-lg"}`}>{what}</p>}
      </div>

      {code && (
        <pre className={`overflow-x-auto rounded-lg border border-line/80 bg-bg font-mono leading-snug text-ink ${compact ? "mt-2 p-2.5 text-sm" : "mt-3 p-3 text-base"}`}>
          <code>{code}</code>
        </pre>
      )}

      {points && points.length > 0 && (
        <div className={`grid grid-cols-2 gap-2 text-mute ${compact ? "mt-2 text-sm" : "mt-3 text-base"}`}>
          {points.map((p, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
              <span className="leading-snug">{p}</span>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
