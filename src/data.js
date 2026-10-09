"use strict";


const users = [
  { id: 1, username: "alex", password: "maple123", displayName: "Alex Rivera", role: "member", email: "alex@example.test" },
  { id: 2, username: "sam", password: "orbit456", displayName: "Sam Lee", role: "member", email: "sam@example.test" }
];

const notes = [
  { id: 101, owner: 1, title: "Weekend plan", body: "Bring the blue notebook to the study group." },
  { id: 202, owner: 2, title: "Club idea", body: "Try a beginner-friendly web security workshop." }
];

module.exports = { users, notes };
