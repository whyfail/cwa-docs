import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) return { meta: {}, body: source };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const field = line.match(/^([\w-]+):\s*(.*)$/);
    if (!field) return;
    let value = field[2].trim().replace(/^['"]|['"]$/g, "");
    meta[field[1]] = value;
  });
  return { meta, body: source.slice(match[0].length) };
}

function docTitle(relPath) {
  const source = fs.readFileSync(path.join(root, relPath), "utf8");
  const { meta, body } = parseFrontmatter(source);
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return meta.title || heading || path.basename(relPath, ".md");
}

function listMd(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.posix.join(dir, file));
}

export function generateSidebar() {
  const guide = ["intro.md"].filter((rel) =>
    fs.existsSync(path.join(root, rel)),
  );
  const skill = ["skill.md"].filter((rel) =>
    fs.existsSync(path.join(root, rel)),
  );
  const core = listMd("core").sort((a, b) => {
    const posA = Number(parseFrontmatter(fs.readFileSync(path.join(root, a), "utf8")).meta.sidebar_position || 99);
    const posB = Number(parseFrontmatter(fs.readFileSync(path.join(root, b), "utf8")).meta.sidebar_position || 99);
    return posA - posB;
  });
  const logs = listMd("log").sort((a, b) => b.localeCompare(a));

  const years = new Map();
  for (const rel of logs) {
    const year = path.basename(rel).match(/\d{4}/)?.[0] || "其他";
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(rel);
  }

  const sidebar = {};

  if (guide.length) {
    sidebar["/intro"] = [{ text: "快速开始", items: guide.map((rel) => ({ text: docTitle(rel), link: `/${rel.replace(/\.md$/, "")}` })) }];
  }

  if (skill.length) {
    sidebar["/skill"] = [{ text: "Skill", items: skill.map((rel) => ({ text: docTitle(rel), link: `/${rel.replace(/\.md$/, "")}` })) }];
  }

  if (core.length) {
    sidebar["/core/"] = [{
      text: "模板文档",
      items: core.map((rel) => ({ text: docTitle(rel), link: `/${rel.replace(/\.md$/, "")}` })),
    }];
  }

  if (logs.length) {
    sidebar["/log/"] = [...years.entries()].map(([year, files]) => ({
      text: year,
      collapsed: year !== String(new Date().getFullYear()),
      items: files.map((rel) => ({ text: docTitle(rel), link: `/${rel.replace(/\.md$/, "")}` })),
    }));
  }

  return sidebar;
}
