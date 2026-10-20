import QRCode from "qrcode";

/** A QR code drawn as one SVG path, with the quiet border scanners need. */
export function QrCode({ text, label, className }: { text: string; label: string; className?: string }) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  const size = modules.size;
  const quiet = 2;
  let d = "";
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (modules.get(row, col)) d += `M${col + quiet} ${row + quiet}h1v1h-1z`;
    }
  }
  const span = size + quiet * 2;
  return (
    <svg viewBox={`0 0 ${span} ${span}`} className={className} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={span} height={span} fill="var(--color-paper)" />
      <path d={d} fill="var(--color-ink)" />
    </svg>
  );
}
