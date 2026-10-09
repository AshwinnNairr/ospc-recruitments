"use strict";

const http = require("node:http");
const { URL } = require("node:url");
const { users, notes } = require("./data");
const { send, page, readBody, getUserFromRequest, makeSessionToken, json } = require("./web");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const method = req.method || "GET";

  try {
    if (method === "GET" && url.pathname === "/") {
      return send(res, 200, page("Welcome", `<h1>Welcome to the demo portal</h1><p>This fictional app is provided for a local source-code review exercise.</p><p><a href="/login">Sign in</a> · <a href="/search">Search the club directory</a> · <a href="/health">Health check</a></p><p class="muted">Demo users: <code>alex</code> / <code>maple123</code> and <code>sam</code> / <code>orbit456</code>.</p>`));
    }

    if (method === "GET" && url.pathname === "/health") return json(res, 200, { status: "ok", mode: "local demo" });

    if (method === "GET" && url.pathname === "/login") {
      return send(res, 200, page("Sign in", `<h1>Sign in</h1><form method="post" action="/login"><label>Username <input name="username" autocomplete="username" required></label><label>Password <input name="password" type="password" autocomplete="current-password" required></label><button>Sign in</button></form><p class="muted">Use one of the demo accounts shown on the home page.</p>`));
    }

    if (method === "POST" && url.pathname === "/login") {
      const body = new URLSearchParams(await readBody(req));
      const user = users.find(item => item.username === body.get("username") && item.password === body.get("password"));
      if (!user) return send(res, 401, page("Sign in", `<h1>Sign in</h1><p>That demo username and password did not match.</p><p><a href="/login">Try again</a></p>`));
      return send(res, 302, "", "text/plain; charset=utf-8", { "Set-Cookie": `sid=${makeSessionToken(user.username)}; Path=/; SameSite=Lax`, Location: "/dashboard" });
    }

    if (method === "GET" && url.pathname === "/dashboard") {
      const user = getUserFromRequest(req);
      if (!user) return send(res, 401, page("Sign in required", `<h1>Please sign in</h1><p><a href="/login">Go to sign in</a></p>`));
      const mine = notes.filter(note => note.owner === user.id);
      const noteLinks = mine.map(note => `<div class="note"><strong>${note.title}</strong> — <a href="/api/notes/${note.id}">view note ${note.id}</a></div>`).join("");
      return send(res, 200, page("Dashboard", `<h1>Hello, ${user.displayName}</h1><p>Signed in as <code>${user.username}</code> (${user.role}).</p><p><a href="/profile">Edit profile</a> · <a href="/admin">Admin area</a> · <a href="/logout">Sign out</a></p><h2>Your notes</h2>${noteLinks || "<p>No notes.</p>"}`));
    }

    if (method === "GET" && url.pathname.startsWith("/api/notes/")) {
      const user = getUserFromRequest(req);
      if (!user) return json(res, 401, { error: "sign in required" });
      const id = Number(url.pathname.split("/").pop());
      const note = notes.find(item => item.id === id);
      if (!note) return json(res, 404, { error: "note not found" });
      return json(res, 200, { id: note.id, title: note.title, body: note.body });
    }

    if (method === "GET" && url.pathname === "/profile") {
      const user = getUserFromRequest(req);
      if (!user) return send(res, 401, page("Sign in required", `<h1>Please sign in</h1><p><a href="/login">Go to sign in</a></p>`));
      return send(res, 200, page("Profile", `<h1>Edit profile</h1><p>Profile API accepts JSON. Use your browser console or an HTTP client while signed in.</p><pre>POST /api/profile
Content-Type: application/json
{"displayName":"New Name"}</pre><p><a href="/dashboard">Back to dashboard</a></p>`));
    }

    if (method === "POST" && url.pathname === "/api/profile") {
      const user = getUserFromRequest(req);
      if (!user) return json(res, 401, { error: "sign in required" });
      let changes;
      try { changes = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: "expected JSON" }); }
      if (!changes || typeof changes !== "object" || Array.isArray(changes)) return json(res, 400, { error: "expected a JSON object" });
      Object.assign(user, changes);
      return json(res, 200, { ok: true, profile: { username: user.username, displayName: user.displayName, role: user.role } });
    }

    if (method === "GET" && url.pathname === "/admin") {
      const user = getUserFromRequest(req);
      if (!user) return send(res, 401, page("Sign in required", `<h1>Please sign in</h1><p><a href="/login">Go to sign in</a></p>`));
      if (user.role !== "admin") return send(res, 403, page("Access denied", `<h1>Access denied</h1><p>This area is for admin accounts.</p><p><a href="/dashboard">Back to dashboard</a></p>`));
      return send(res, 200, page("Admin area", `<h1>Admin area</h1><p>Training flag: <code>OSPC{synthetic_training_flag}</code></p><p><a href="/dashboard">Back to dashboard</a></p>`));
    }

    if (method === "GET" && url.pathname === "/search") {
      const query = url.searchParams.get("q") || "";
      const found = users.filter(user => user.displayName.toLowerCase().includes(query.toLowerCase()));
      const items = found.map(user => `<li>${user.displayName} — ${user.email}</li>`).join("") || "<li>No matches</li>";
      return send(res, 200, page("Directory search", `<h1>Club directory search</h1><form method="get" action="/search"><label>Search names <input name="q" value="${query}"></label><button>Search</button></form><h2>Results for: ${query}</h2><ul>${items}</ul><p><a href="/">Home</a></p>`));
    }

    if (method === "GET" && url.pathname === "/logout") {
      return send(res, 302, "", "text/plain; charset=utf-8", { "Set-Cookie": "sid=; Path=/; Max-Age=0; SameSite=Lax", Location: "/" });
    }

    return send(res, 404, page("Not found", `<h1>Page not found</h1><p><a href="/">Home</a></p>`));
  } catch (error) {
    console.error("Request failed:", error.message);
    return send(res, 500, page("Error", `<h1>Something went wrong</h1><p>Please try again.</p>`));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`OSPC demo listening at http://${HOST}:${PORT}`);
  console.log("Synthetic training data only. Keep this server on your own computer.");
});
