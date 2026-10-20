// `npm run present` (after `next build`) and `npm start`: serves the built deck from
// out/ on port 3000 to this laptop and to the iPad and projector on the same Wi-Fi,
// and starts the kiosk relay so those pages follow the deck. No dependencies.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lanAddresses, startRelay } from "./kiosk-relay.mjs";

const PORT = 3000;
// The built deck sits next to this scripts folder, wherever it's started from.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const isInside = (target) => target === ROOT || target.startsWith(ROOT + path.sep);
const isFile = (target) => fs.existsSync(target) && fs.statSync(target).isFile();
const isDirectory = (target) => fs.existsSync(target) && fs.statSync(target).isDirectory();

/** Finds the file for a URL path the way the static export lays it out (trailing slashes, index.html). */
function locate(urlPath) {
  const target = path.join(ROOT, decodeURIComponent(urlPath));
  if (!isInside(target)) return { status: 403 };
  if (isFile(target)) return { file: target };
  if (!isDirectory(target)) return { status: 404 };
  if (!urlPath.endsWith("/")) return { redirect: `${urlPath}/` };
  const index = path.join(target, "index.html");
  return isFile(index) ? { file: index } : { status: 404 };
}

function serveFile(res, file, status = 200) {
  res.writeHead(status, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-cache" });
  fs.createReadStream(file).pipe(res);
}

function handle(req, res) {
  const { pathname, search } = new URL(req.url ?? "/", "http://deck");
  const found = locate(pathname);
  if (found.file) return serveFile(res, found.file);
  if (found.redirect) {
    res.writeHead(308, { location: found.redirect + search });
    return res.end();
  }
  const notFound = path.join(ROOT, "404.html");
  if (found.status === 404 && isFile(notFound)) return serveFile(res, notFound, 404);
  res.writeHead(found.status ?? 404);
  res.end();
}

function printAddresses() {
  const lan = lanAddresses();
  console.log("\nFold with Nara is running.\n");
  console.log(`  Deck (this laptop):  http://localhost:${PORT}/`);
  console.log(`  Kiosk setup:         http://localhost:${PORT}/kiosk/`);
  for (const address of lan) {
    console.log(`  iPad screen:         http://${address}:${PORT}/kiosk/screen/`);
    console.log(`  Projector:           http://${address}:${PORT}/kiosk/projector/`);
  }
  if (lan.length === 0) console.log("  No Wi-Fi address found. Join the same network as the iPad to use the kiosk pages.");
  console.log("\nPress Ctrl+C to stop.\n");
}

if (!isDirectory(ROOT)) {
  console.error("There's no built deck in out/. Run `npm run present`, which builds it first.");
  process.exit(1);
}

startRelay();
http.createServer(handle).listen(PORT, printAddresses);
