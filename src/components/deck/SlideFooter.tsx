import { sources, type SourceKey } from "@/content/sources";

/** Fine-print sources on the left, the section this slide covers on the right. */
export function SlideFooter({ sourceKeys, section }: { sourceKeys: SourceKey[]; section?: string }) {
  if (sourceKeys.length === 0 && !section) return null;
  return (
    <footer className="absolute inset-x-24 bottom-7 flex items-end justify-between gap-12 text-fine text-ink-faint">
      <p className="max-w-[1300px]">
        {sourceKeys.length > 0 ? `Sources: ${sourceKeys.map((key) => sources[key].cite).join("; ")}` : null}
      </p>
      {section ? <p className="shrink-0 text-ink-muted font-bold">{section}</p> : null}
    </footer>
  );
}
