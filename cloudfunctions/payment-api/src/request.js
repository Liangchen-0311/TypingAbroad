"use strict";

const MAX_BODY_BYTES = 64 * 1024;

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, "BODY_TOO_LARGE", "Request body is too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function readJson(req) {
  const body = await readBody(req);
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    throw new HttpError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
}

function parseForm(body) {
  return Object.fromEntries(new URLSearchParams(body).entries());
}

function parseCloudbaseUser(req) {
  const encoded = req.headers["x-cloudbase-context"];
  if (typeof encoded !== "string" || encoded.length > 16384) return null;
  try {
    const context = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
    const uid = context?.uid ?? context?.TCB_UUID;
    if (typeof uid !== "string" || !/^[A-Za-z0-9_\-#@~=*(){}[\]:.,<>+]{4,128}$/.test(uid)) return null;
    return { uid };
  } catch {
    return null;
  }
}

function requestPath(req) {
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  return pathname.startsWith("/api/") ? pathname.slice(4) : pathname;
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

function sendText(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

module.exports = {
  HttpError,
  parseCloudbaseUser,
  parseForm,
  readBody,
  readJson,
  requestPath,
  sendJson,
  sendText,
};
