#!/usr/bin/env node
// Builds a gather board from .gather/<brief>/candidates/*.json and board.json.
//   node collect.mjs .gather/<brief>            build once
//   node collect.mjs .gather/<brief> --serve    serve, rebuild on change, keep the board reloading
//   node collect.mjs .gather/<brief> --done     build a last time and stop the reloading
// Options: --port <n> (default 4800).

import { createHash } from "node:crypto";
import { createReadStream, watch } from "node:fs";
import { copyFile, mkdir, readdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { homedir } from "node:os";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const target = args.find((arg, index) => !arg.startsWith("--") && args[index - 1] !== "--port");
if (!target) {
  console.error("Usage: node collect.mjs .gather/<brief> [--serve] [--done] [--port 4800]");
  process.exit(1);
}

const dir = resolve(target);
const serving = args.includes("--serve");
const done = args.includes("--done");
const port = Number(args[args.indexOf("--port") + 1]) || 4800;
const candidatesDir = join(dir, "candidates");
const imgDir = join(dir, "img");
const template = join(dirname(fileURLToPath(import.meta.url)), "board.html");

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const VIDEO = new Set(["mp4", "webm", "mov", "m4v"]);
const MIME = {
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};
const AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

const failures = new Map();

const extensionOf = (path) => extname(path.split(/[?#]/)[0]).slice(1).toLowerCase();
const keyOf = (media) => createHash("sha1").update(media).digest("hex").slice(0, 16);
const inside = (path) => path === dir || path.startsWith(dir + sep);
const toPosix = (path) => path.split(sep).join("/");

function titleCase(slug) {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw new Error(`${basename(path)}: ${error.message}`);
  }
}

async function download(media, page, key) {
  const response = await fetch(media, {
    headers: {
      "user-agent": AGENT,
      accept: "image/avif,image/webp,image/*,video/*;q=0.9,*/*;q=0.8",
      referer: new URL(page).origin + "/",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (type.startsWith("text/")) throw new Error(`got ${type}, not an image or video`);
  const extension = EXTENSIONS[type] ?? extensionOf(media);
  if (!MIME[extension]) throw new Error(`unknown type ${type || "with no content type"}`);
  const name = `${key}.${extension}`;
  await writeFile(join(imgDir, name), Buffer.from(await response.arrayBuffer()));
  return name;
}

async function localize(media, page, cache) {
  if (/^https?:\/\//i.test(media)) {
    const key = keyOf(media);
    if (cache.has(key)) return `img/${cache.get(key)}`;
    if (failures.has(key)) throw new Error(failures.get(key));
    try {
      const name = await download(media, page, key);
      cache.set(key, name);
      return `img/${name}`;
    } catch (error) {
      const message = error.name === "TimeoutError" ? "timed out" : (error.cause?.code ?? error.message);
      failures.set(key, message);
      throw new Error(message);
    }
  }

  let path = media.startsWith("file://") ? fileURLToPath(media) : media.replace(/^~(?=\/)/, homedir());
  path = isAbsolute(path) ? path : resolve(dir, path);
  const info = await stat(path).catch(() => null);
  if (!info?.isFile()) throw new Error(`no file at ${media}`);
  if (inside(path)) return toPosix(relative(dir, path));

  const key = keyOf(path);
  if (!cache.has(key)) {
    const name = `${key}.${extensionOf(path) || "bin"}`;
    await copyFile(path, join(imgDir, name));
    cache.set(key, name);
  }
  return `img/${cache.get(key)}`;
}

async function pool(list, size, task) {
  let next = 0;
  const worker = async () => {
    while (next < list.length) await task(list[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(size, list.length) }, worker));
}

async function build(live) {
  await mkdir(candidatesDir, { recursive: true });
  await mkdir(imgDir, { recursive: true });

  const meta = await readJson(join(dir, "board.json"), {});
  const cut = new Set(meta.cut ?? []);
  const seen = new Set();
  const problems = [];
  const items = [];

  const files = (await readdir(candidatesDir)).filter((file) => file.endsWith(".json")).sort();
  for (const file of files) {
    let list;
    try {
      list = await readJson(join(candidatesDir, file), []);
    } catch (error) {
      problems.push(error.message);
      continue;
    }
    for (const item of Array.isArray(list) ? list : (list.items ?? [])) {
      const missing = ["title", "source", "url", "media"].filter((field) => !item[field]);
      if (missing.length) {
        problems.push(`${file}: ${item.title ?? item.url ?? "an item"} has no ${missing.join(", ")}`);
        continue;
      }
      if (seen.has(item.url) || cut.has(item.url)) continue;
      seen.add(item.url);
      items.push(item);
    }
  }
  const own = (item) => (/^(Pond|marked\.dev)(?! › Explore)/.test(item.source) ? 0 : 1);
  items.sort((a, b) => own(a) - own(b));

  const cache = new Map();
  for (const file of await readdir(imgDir)) cache.set(file.split(".")[0], file);

  const failed = [];
  await pool(items, 8, async (item) => {
    try {
      item.media = await localize(item.media, item.url, cache);
      if (item.poster) item.poster = await localize(item.poster, item.url, cache).catch(() => undefined);
    } catch (error) {
      item.failed = true;
      failed.push(`${item.title} (${item.source}): ${error.message}`);
    }
  });

  const groups = new Map((meta.groups ?? []).map((group) => [group.title, { ...group, items: [] }]));
  for (const item of items) {
    if (item.failed) continue;
    const title = item.group || "Other";
    if (!groups.has(title)) groups.set(title, { title, items: [] });
    groups.get(title).items.push({
      title: item.title,
      source: item.source,
      url: item.url,
      media: item.media,
      kind: item.kind ?? (VIDEO.has(extensionOf(item.media)) ? "video" : "image"),
      poster: item.poster,
      note: item.note ?? "",
      details: item.details,
    });
  }

  const board = {
    title: meta.title ?? titleCase(basename(dir)),
    brief: meta.brief ?? "",
    live,
    groups: [...groups.values()].filter((group) => group.items.length > 0),
  };

  await copyFile(template, join(dir, "index.html"));
  await writeFile(join(dir, "board.js.tmp"), `window.board = ${JSON.stringify(board, null, 2)};\n`);
  await rename(join(dir, "board.js.tmp"), join(dir, "board.js"));

  const total = board.groups.reduce((sum, group) => sum + group.items.length, 0);
  const lines = [`${total} references in ${board.groups.length} groups${live ? "" : ", done"}`];
  for (const group of board.groups) lines.push(`  ${group.title}: ${group.items.length}`);
  for (const line of failed) lines.push(`Failed: ${line}`);
  for (const line of problems) lines.push(`Skipped: ${line}`);
  if (files.length === 0) lines.push(`No candidates yet in ${toPosix(relative(process.cwd(), candidatesDir))}/`);
  console.log(lines.join("\n"));
}

let building = null;
let again = false;

async function rebuild() {
  if (building) {
    again = true;
    return;
  }
  building = build(!done).catch((error) => console.error(error.message));
  await building;
  building = null;
  if (again) {
    again = false;
    rebuild();
  }
}

await rebuild();

if (serving) {
  const server = createServer(async (request, response) => {
    let path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = resolve(dir, `.${path}`);
    const info = inside(file) ? await stat(file).catch(() => null) : null;
    if (!info?.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }

    const headers = {
      "content-type": MIME[extensionOf(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
      "accept-ranges": "bytes",
    };
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range ?? "");
    let start = 0;
    let end = info.size - 1;
    if (range) {
      start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]));
      end = range[1] && range[2] ? Math.min(end, Number(range[2])) : end;
      if (start > end) {
        response.writeHead(416, { "content-range": `bytes */${info.size}` }).end();
        return;
      }
      headers["content-range"] = `bytes ${start}-${end}/${info.size}`;
    }
    headers["content-length"] = end - start + 1;
    response.writeHead(range ? 206 : 200, headers);
    if (request.method === "HEAD") response.end();
    else createReadStream(file, { start, end }).pipe(response);
  });

  let attempt = 0;
  server.on("listening", () => console.log(`Serving http://127.0.0.1:${server.address().port}/`));
  server.on("error", (error) => {
    if (error.code !== "EADDRINUSE" || ++attempt >= 20) throw error;
    server.listen(port + attempt, "127.0.0.1");
  });
  server.listen(port, "127.0.0.1");

  let timer = 0;
  const changed = () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 300);
  };
  watch(dir, (_, file) => file === "board.json" && changed());
  watch(candidatesDir, (_, file) => file?.endsWith(".json") && changed());
}
