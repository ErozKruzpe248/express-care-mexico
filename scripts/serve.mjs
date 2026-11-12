import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

const directory = process.argv[2] ?? "src";
if (directory !== "src" && directory !== "dist") {
  throw new Error("El servidor admite src/ o dist/.");
}
const root = await realpath(new URL(`../${directory}/`, import.meta.url));
const host = "127.0.0.1";
const port = Number(process.env.EXPRESS_CARE_PORT ?? 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("EXPRESS_CARE_PORT debe ser un puerto entre 1 y 65535.");
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function withinRoot(file) {
  const route = relative(root, file);
  return route !== ".." && !route.startsWith(`..${sep}`) && !isAbsolute(route);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  const target = resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
  if (!withinRoot(target)) {
    response.writeHead(404).end();
    return;
  }

  try {
    const file = await realpath(target);
    const info = await stat(file);
    if (!withinRoot(file) || !info.isFile()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const stream = createReadStream(file);
    stream.once("error", () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    const notFound = ["ENOENT", "ENOTDIR", "ERR_INVALID_ARG_VALUE"].includes(error.code);
    response.writeHead(notFound ? 404 : 500).end();
  }
});

server.listen(port, host, () => {
  console.log(`Express Care México · http://${host}:${port}/ (${directory}/)`);
});
