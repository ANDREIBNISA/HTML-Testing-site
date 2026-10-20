// Rebuilds index.html as a list of every .html file in the repo.
const fs = require("fs");
const path = require("path");

const SKIP_DIRS = new Set([".git", ".github", "node_modules"]);

function findHtml(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) findHtml(full, found);
    } else if (entry.name.toLowerCase().endsWith(".html")) {
      found.push(path.relative(".", full).split(path.sep).join("/"));
    }
  }
  return found;
}

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const files = findHtml(".")
  .filter((f) => f !== "index.html")
  .sort((a, b) => a.localeCompare(b));

const items = files
  .map((f) => {
    const href = f.split("/").map(encodeURIComponent).join("/");
    return `    <li><a href="${href}">${escapeHtml(f)}</a></li>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index</title>
</head>
<body>
  <h1>HTML Files</h1>
  <ul>
${items}
  </ul>
</body>
</html>
`;

fs.writeFileSync("index.html", html);
console.log(`index.html written with ${files.length} link(s)`);
