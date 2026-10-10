import type { Section, SlideData } from "@/lib/types";
import { SectionIntro } from "./SectionIntro";
import { FlowDiagram } from "./FlowDiagram";
import { CodeBlock } from "./CodeBlock";
import { ArchBackdrop } from "./ArchBackdrop";

/** Chooses a layout by slide.type. Add new layouts here. */
export function Slide({ slide, section }: { slide: SlideData; section: Section }) {
  if (slide.type === "section") return <SectionIntro slide={slide} section={section} />;

  if (slide.type === "title" || slide.type === "closing") {
    return (
      <div className="relative h-full">
        <ArchBackdrop />
        <div className="relative flex h-full flex-col justify-center px-28">
          <h1 className={`font-bold leading-none tracking-tight ${slide.type === "title" ? "text-[150px] uppercase" : "text-[140px]"}`}>{slide.title}</h1>
          {slide.subtitle && <p className="mt-8 text-5xl text-mute">{slide.subtitle}</p>}
        </div>
      </div>
    );
  }

  const heading = (
    <div className="shrink-0">
      <h2 className="text-5xl font-bold tracking-tight">{slide.title}</h2>
      {slide.subtitle && <p className="mt-2 text-2xl text-mute">{slide.subtitle}</p>}
    </div>
  );

  if (slide.type === "side") {
    return (
      <div className="flex h-full items-center gap-14 px-28 pb-16 pt-24">
        <div className="w-[460px] shrink-0">{heading}</div>
        <div className="flex flex-1 items-center justify-center min-w-0">{slide.body}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-28 pb-16 pt-24">
      {heading}
      <div className="mt-6 flex flex-1 items-center min-w-0">
        {slide.type === "content" && (
          <ul className="space-y-6 text-4xl leading-snug">
            {slide.bullets?.map((b) => (
              <li key={b} className="flex gap-5">
                <span className="mt-4 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: section.accent }} />
                {b}
              </li>
            ))}
          </ul>
        )}
        {slide.type === "flow" && slide.flow && <FlowDiagram steps={slide.flow} accent={section.accent} />}
        {slide.type === "code" && slide.code && <CodeBlock code={slide.code.text} lang={slide.code.lang} accent={section.accent} />}
        {slide.type === "visual" && slide.body}
      </div>
    </div>
  );
}
