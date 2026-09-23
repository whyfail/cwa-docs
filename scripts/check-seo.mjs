/**
 * 构建产物 GEO 验收（方案 §六）：
 *   node scripts/check-seo.mjs
 * 检查 .vitepress/dist 下每个内容页的 title/description/canonical/og/JSON-LD/h1，
 * 以及 sitemap、robots、llms、RSS、md 原文副本是否齐全。缺项以 1 退出。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, ".vitepress", "dist");
const ORIGIN = "https://whyfail.github.io/cwa-docs";

const errors = [];

if (!fs.existsSync(dist)) {
  console.error("缺少构建产物，请先运行 npm run build");
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(abs);
    return [abs];
  });
}

const allFiles = walk(dist);
const htmlPages = allFiles.filter(
  (file) => file.endsWith(".html") && !file.endsWith("404.html") && !file.endsWith("README.html"),
);
const mdPages = allFiles.filter((file) => file.endsWith(".md"));

// 1. 每个内容页 head 完整性
for (const file of htmlPages) {
  const rel = path.relative(dist, file);
  const html = fs.readFileSync(file, "utf8");
  const checks = [
    [/<title>[^<|]+\| [^<]+<\/title>|<title>[^<]+<\/title>/.test(html), "title"],
    [/<meta name="description" content="[^"]{20,}"/.test(html), "description(≥20字)"],
    [html.includes(`<link rel="canonical" href="${ORIGIN}`), "canonical(生产域名)"],
    [html.includes('property="og:title"'), "og:title"],
    [html.includes('property="og:description"'), "og:description"],
    [html.includes('property="og:url"'), "og:url"],
    [html.includes('application/ld+json'), "JSON-LD"],
    [/<h1[\s>]/.test(html), "h1(SSG 正文)"],
  ];
  for (const [ok, label] of checks) {
    if (!ok) errors.push(`${rel}: 缺 ${label}`);
  }
  // 正文非空壳：剥掉 script/style 后可见文本量
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "");
  if (text.length < 300) errors.push(`${rel}: 可见文本过少(${text.length}字符)，疑似空壳`);
}

// 2. 每个内容页有 md 原文副本（URL+.md 直出）
const contentPages = htmlPages.filter((file) => !file.endsWith("index.html") || path.dirname(file) !== dist);
for (const file of contentPages) {
  const md = file.replace(/\.html$/, ".md");
  if (!fs.existsSync(md)) errors.push(`${path.relative(dist, file)}: 缺 .md 原文副本`);
}

// 3. 全局 GEO 文件
for (const name of ["robots.txt", "llms.txt", "llms-full.txt", "feed.rss", "sitemap.xml", "logo.png"]) {
  if (!fs.existsSync(path.join(dist, name))) errors.push(`缺 ${name}`);
}

// 4. sitemap：数量与页面一致、全部为生产域名 + base
const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== htmlPages.length) {
  errors.push(`sitemap 数量(${locs.length}) != 页面数(${htmlPages.length})`);
}
for (const loc of locs) {
  if (!loc.startsWith(`${ORIGIN}/`) && loc !== `${ORIGIN}/`) errors.push(`sitemap 非生产地址: ${loc}`);
}

// 5. llms.txt 覆盖全部内容页
const llms = fs.readFileSync(path.join(dist, "llms.txt"), "utf8");
const llmsEntries = (llms.match(/^- \[/gm) || []).length;
if (llmsEntries !== mdPages.length - 1) {
  // mdPages 含 index.md（llms 索引不含首页）
  errors.push(`llms.txt 条目(${llmsEntries}) != 内容页(${mdPages.length - 1})`);
}

// 6. RSS 仅含 log 页
const rss = fs.readFileSync(path.join(dist, "feed.rss"), "utf8");
const items = (rss.match(/<item>/g) || []).length;
const logCount = fs.readdirSync(path.join(root, "log")).filter((f) => f.endsWith(".md")).length;
if (items !== logCount) errors.push(`RSS item(${items}) != log 数(${logCount})`);
if (items && !rss.includes("/log/")) errors.push("RSS item 链接缺 /log/ 路径");

// 7. 无空壳 meta：description 不应全站相同
const descs = new Set(
  htmlPages.map((file) => fs.readFileSync(file, "utf8").match(/<meta name="description" content="([^"]*)"/)?.[1]),
);
if (descs.size < htmlPages.length * 0.8) {
  errors.push(`description 雷同严重：${descs.size} 种 / ${htmlPages.length} 页`);
}

if (errors.length) {
  console.error(`SEO 验收失败（${errors.length} 项）：`);
  for (const line of errors) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`SEO 验收通过：${htmlPages.length} 页、${locs.length} sitemap、${items} RSS、${llmsEntries} llms 条目`);
