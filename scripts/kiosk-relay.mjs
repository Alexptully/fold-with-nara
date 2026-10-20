// The kiosk relay. The deck posts its latest state here, and the demo kiosk's
// pages (the iPad screen and the projector) listen with server-sent events.
// It keeps only the newest state, so a page that opens late catches up at once.
// No dependencies, so it runs anywhere Node does. `npm run dev` and
// `npm run present` start it for you; `npm run relay` runs it on its own.
import http from "node:http";
import os from "node:os";
import { pathToFileURL } from "node:url";

export const RELAY_PORT = 3001;
const ROLES = ["screen", "projector"];
const ROLE_NAMES = { screen: "iPad screen", projector: "projector" };
const MAX_BODY = 64 * 1024;
const PING_MS = 15000;

/** The laptop's addresses on the local network, for the iPad to type or scan. */
export function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((entry) => entry && entry.family === "IPv4" && !entry.internal)
    .map((entry) => entry.address);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY) reject(new Error("too large"));
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

// The same rules as isNewer in src/lib/kiosk/protocol.ts: within one deck the higher
// number wins; between two open decks the newer action wins, so an old tab's
// heartbeat can't pull the kiosk back.
function isNewer(next, current) {
  if (!current) return true;
  if (current.deck !== next.deck) return next.at > current.at;
  return next.seq > current.seq;
}

function isMessage(value) {
  return typeof value?.deck === "string" && typeof value?.seq === "number" && typeof value?.at === "number" && typeof value?.scene?.kind === "string";
}

function sendJson(res, status, value) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(value));
}

function createRelay(log) {
  let latest = null;
  const clients = new Set();

  const viewers = () => Object.fromEntries(ROLES.map((role) => [role, [...clients].filter((client) => client.role === role).length]));
  const push = (client, message) => client.res.write(`event: state\ndata: ${JSON.stringify(message)}\n\n`);
  const announce = (role, verb) => {
    const counts = viewers();
    log(`Kiosk ${ROLE_NAMES[role]} ${verb} (${counts.screen} screen, ${counts.projector} projector)`);
  };

  const listen = (req, res, url) => {
    const role = ROLES.includes(url.searchParams.get("role")) ? url.searchParams.get("role") : "screen";
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache, no-transform", connection: "keep-alive" });
    res.write("retry: 3000\n\n");
    const client = { res, role };
    clients.add(client);
    if (latest) push(client, latest);
    announce(role, "connected");
    req.on("close", () => {
      clients.delete(client);
      announce(role, "left");
    });
  };

  const receive = async (req, res) => {
    const message = JSON.parse(await readBody(req));
    if (!isMessage(message)) return sendJson(res, 400, { ok: false });
    if (isNewer(message, latest)) {
      latest = message;
      for (const client of clients) push(client, message);
    }
    sendJson(res, 200, { ok: true, viewers: viewers() });
  };

  const status = (req, res) => sendJson(res, 200, { viewers: viewers(), addresses: lanAddresses(), slide: latest?.slide ?? null });

  const ping = setInterval(() => {
    for (const client of clients) client.res.write(": ping\n\n");
  }, PING_MS);

  return { routes: { "GET /events": listen, "POST /state": receive, "GET /status": status }, stop: () => clearInterval(ping) };
}

function allowAnyOrigin(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "OPTIONS") return false;
  res.writeHead(204, { "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type" });
  res.end();
  return true;
}

/** Starts the relay. If the port is taken, it says so and the rest of the deck keeps running. */
export function startRelay({ port = RELAY_PORT, log = console.log } = {}) {
  const relay = createRelay(log);
  const server = http.createServer((req, res) => {
    if (allowAnyOrigin(req, res)) return;
    const url = new URL(req.url ?? "/", "http://relay");
    const route = relay.routes[`${req.method} ${url.pathname}`];
    if (!route) return sendJson(res, 404, { ok: false });
    Promise.resolve(route(req, res, url)).catch(() => sendJson(res, 400, { ok: false }));
  });
  server.on("error", (error) => {
    relay.stop();
    const reason = error.code === "EADDRINUSE" ? `port ${port} is already in use (is another copy of the deck running?)` : error.message;
    log(`Kiosk relay didn't start: ${reason}. The deck still works; the kiosk pages won't follow it.`);
  });
  server.on("close", relay.stop);
  server.listen(port);
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startRelay();
  console.log(`Kiosk relay listening on port ${RELAY_PORT}.`);
}
