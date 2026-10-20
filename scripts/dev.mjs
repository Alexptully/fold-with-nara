// `npm run dev`: the Next.js dev server plus the kiosk relay, so the iPad and
// projector pages follow the deck while you rehearse. Extra arguments go to
// `next dev` (for example `npm run dev -- -p 4000`).
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { startRelay } from "./kiosk-relay.mjs";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const relay = startRelay();
const next = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], { stdio: "inherit" });

next.on("exit", (code) => {
  relay.close();
  process.exit(code ?? 0);
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => next.kill(signal));
