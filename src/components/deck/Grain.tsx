import { asset } from "@/lib/paths";

/** Paper grain over the whole stage. Purely visual, so it ignores the pointer. */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 opacity-70 mix-blend-multiply"
      style={{ backgroundImage: `url(${asset("/grain.png")})`, backgroundSize: "256px 256px" }}
    />
  );
}
