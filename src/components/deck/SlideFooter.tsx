import { sources, type SourceKey } from "@/content/sources";

/** Fine-print sources on the left, the section this slide covers on the right. */
export function SlideFooter({ sourceKeys, section }: { sourceKeys: SourceKey[]; section?: string }) {
  if (sourceKeys.length === 0 && !section) return null;
  return (
    <footer className="absolute inset-x-24 bottom-6 flex items-end justify-between gap-12 text-cite text-ink-muted">
      <p className="max-w-[1250px]">
        {sourceKeys.length > 0 ? `Sources: ${sourceKeys.map((key) => sources[key].cite).join("; ")}` : null}
      </p>
      {section ? <p className="shrink-0 font-bold">{section}</p> : null}
    </footer>
  );
}
