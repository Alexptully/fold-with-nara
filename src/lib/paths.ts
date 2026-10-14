// Prefixes public asset paths with the GitHub Pages base path when there is one.
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
