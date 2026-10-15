"use client";

import { sources, type Source } from "@/content/sources";
import { sourcesSlide } from "@/content/content";
import { SlideShell } from "../primitives";

const list: Source[] = Object.values(sources);

/** The link reads as its site name; the full address is in the link itself. */
const siteOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export function SourcesSlide() {
  return (
    <SlideShell heading={sourcesSlide.heading}>
      <ol className="absolute left-24 right-24 top-[176px] columns-2 gap-16" data-no-advance>
        {list.map((source) => (
          <li key={source.title} className="mb-4 break-inside-avoid text-cite text-ink">
            <p className="text-small font-extrabold">{source.cite}</p>
            <p className="text-ink-muted">{source.title}</p>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer" className="text-accent-ink underline underline-offset-2">
                {siteOf(source.url)}
              </a>
            ) : (
              <p className="text-ink-muted">Course handout, no public link</p>
            )}
          </li>
        ))}
      </ol>
    </SlideShell>
  );
}
