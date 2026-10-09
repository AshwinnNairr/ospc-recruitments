"use strict";

const { users } = require("./data");

function send(res, status, body, contentType = "text/html; charset=utf-8", headers = {}) {
  res.writeHead(status, { "Content-Type": contentType, "X-Content-Type-Options": "nosniff", ...headers });
  res.end(body);
}

function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · OSPC Demo</title><style>
    body{font:16px/1.5 system-ui,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;color:#202733;background:#f6f8fb}header,main{background:white;border:1px solid #dce2ea;border-radius:12px;padding:1.2rem;margin-bottom:1rem}h1{font-size:1.5rem;margin-top:0}a{color:#075bb5}input,button{font:inherit;padding:.55rem;margin:.2rem 0}label{display:block;margin:.5rem 0}code{background:#eef2f6;padding:.1rem .3rem;border-radius:4px}.muted{color:#596579}.note{border-top:1px solid #e3e7ed;padding:.6rem 0}
  </style></head><body><header><strong>OSPC Security Review Demo</strong> <span class="muted">· synthetic data · local training app</span></header><main>${body}</main></body></html>`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; if (data.length > 100_000) req.destroy(); });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf("="); return i < 0 ? [v, ""] : [v.slice(0, i), decodeURIComponent(v.slice(i + 1))];
  }));
}

function makeSessionToken(username) {
  return Buffer.from(`${username}:ospc-demo-session`).toString("base64url");
}

function getUserFromRequest(req) {
  const token = cookies(req).sid;
  if (!token) return null;
  try {
    const username = Buffer.from(token, "base64url").toString().split(":")[0];
    return users.find(user => user.username === username) || null;
  } catch { return null; }
}

function json(res, status, value) {
  send(res, status, JSON.stringify(value, null, 2), "application/json; charset=utf-8");
}

module.exports = { send, page, readBody, getUserFromRequest, makeSessionToken, json };
