# OSPC Cybersecurity Recruitment Challenge

Welcome! This repository contains a small fictional web application for a source-code security review. Your task is to **identify and document security vulnerabilities**. Do not fix the application code.

All names, accounts, and records are synthetic. The application is designed to run on your own computer and has no database or external service dependencies.

## Run it locally

You need Node.js 18 or newer. No packages need to be installed.

1. Download or fork this repository.
2. Open a terminal in the repository folder.
3. Run `npm start`.
4. Open <http://127.0.0.1:3000> in your browser.

Stop the server with `Ctrl+C`. The app binds to `127.0.0.1` by default. Keep it local; do not expose it to the internet or use the techniques you learn on systems you do not own or have permission to test.

### Demo accounts

| Username | Password |
| --- | --- |
| `alex` | `maple123` |
| `sam` | `orbit456` |

These are fictional demo credentials, not real accounts. The app resets its in-memory data whenever you restart it.

## Your challenge

Review the source code and the running app, then report **4–5 distinct, supportable security findings**. They vary in difficulty. A useful report explains how the issue arises and what a realistic impact would be; a list of vulnerability names alone is not enough.

You may use AI or other references as learning aids if your recruitment organizer permits it, but your submission and any live follow-up discussion should reflect your own understanding. Be ready to explain your evidence and reasoning.

### How to submit

1. Fork this repository on GitHub.
2. Create `submissions/<your-github-username>.md` using [`submissions/TEMPLATE.md`](submissions/TEMPLATE.md).
3. Commit and push that Markdown file to your fork. Do not change application code.
4. Open a pull request to this repository's default branch. Give it a clear title, such as `Security findings: <your GitHub username>`.

Only submit your own report file. Do not include exploit scripts, real credentials, personal data, or fixes. If GitHub does not allow you to open a PR, send your organizer the fork URL and report path using the contact method they provided.

## What to include for each finding

- A concise title and severity (Informational, Low, Medium, High, or Critical).
- The affected file and line(s), plus the relevant route or feature.
- Evidence: the code path and, when helpful, a safe local demonstration using only this app's synthetic data.
- Impact: what an attacker could realistically access or change.
- A recommended mitigation.

Assess severity based on impact and exploitability; explain your reasoning. If you are uncertain, say so. Avoid duplicate reports of the same underlying cause.

