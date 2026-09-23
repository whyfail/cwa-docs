/**
 * 把 src/content.js 的运行时智能物化为 frontmatter（迁移方案 §四）。
 *
 * 用法：
 *   node scripts/enrich-frontmatter.mjs          # 回填缺失字段（幂等，已有字段不覆盖）
 *   node scripts/enrich-frontmatter.mjs --check  # 只检查缺失，缺字段时以 1 退出（CI 用）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkMode = process.argv.includes("--check");

// —— 规则（自 src/content.js 原样搬运）——

const CATEGORY_RULES = [
  { match: /ai skills?|codex|agent|react grab|智能体|人工智能/i, category: "AI / DEVEX", kicker: "INTELLIGENT WORKFLOW", visual: "neuron", accent: "#efffa1", impact: "开发流程开始具备面向 AI Agent 的上下文、工具和协作边界。" },
  { match: /ssr|next\.js|nextjs|nuxt|服务端渲染/i, category: "ARCHITECTURE", kicker: "CLIENT / SERVER SYSTEM", visual: "attention", accent: "#b99cff", impact: "脚手架从 SPA 扩展到客户端与服务端协同的企业级应用架构。" },
  { match: /spring( boot)?|java ?25|maven|testcontainers|后端模板/i, category: "SPRING ECOSYSTEM", kicker: "JAVA BACKEND TEMPLATE", visual: "scaling", accent: "#6db33f", impact: "脚手架从纯前端扩展到前后端一体的企业级模板体系，Java 后端纳入同一套生成与质量门禁。" },
  { match: /vitest|playwright|测试|质量门禁|coverage|typecheck/i, category: "QUALITY GATES", kicker: "VERIFY BEFORE SHIP", visual: "test", accent: "#bfffee", impact: "变更被更稳定的自动化验证覆盖，模板升级的回归风险随之降低。" },
  { match: /vite|rolldown|oxc|构建|压缩模式|hmr/i, category: "BUILD SYSTEM", kicker: "FASTER FEEDBACK LOOP", visual: "scaling", accent: "#45e8ff", impact: "构建内核与反馈链路持续提速，开发和交付成本进一步下降。" },
  { match: /react|zustand|recoil|antd|ant design|clsx/i, category: "REACT ECOSYSTEM", kicker: "REACT TEMPLATE EVOLUTION", visual: "backprop", accent: "#ff8eb9", impact: "React 模板的状态、组件与工程边界得到持续更新。" },
  { match: /vue|pinia|vue-hooks|volar/i, category: "VUE ECOSYSTEM", kicker: "VUE TEMPLATE EVOLUTION", visual: "perceptron", accent: "#7ef2d6", impact: "Vue 模板持续跟进生态能力，同时保持稳定的开发约定。" },
  { match: /unocss|postcss|pxtorem|css|图标|icon|样式/i, category: "UI / STYLING", kicker: "DESIGN TOOLCHAIN", visual: "vision", accent: "#ffd08a", impact: "样式与组件表达更加轻量、统一，并保持多端适配能力。" },
  { match: /eslint|prettier|git hook|simple-git-hooks|格式化|目录/i, category: "TOOLING", kicker: "CONSISTENT ENGINEERING", visual: "conference", accent: "#89dcff", impact: "团队开发规范被固化到工具链中，减少重复配置与协作偏差。" },
  { match: /路由|router|权限/i, category: "APPLICATION CORE", kicker: "RUNTIME FOUNDATION", visual: "attention", accent: "#9da8ff", impact: "应用运行时基础能力得到完善，业务接入路径更加清晰。" },
];
const FALLBACK_CATEGORY = { category: "PLATFORM UPDATE", kicker: "CREATE-WL-APP CHANGELOG", visual: "agents", accent: "#ffc95e", impact: "cwa-stack 的默认能力与使用体验得到一次可追溯的改进。" };

const KNOWN_TERMS = ["Vite", "Rolldown", "Oxc", "React", "Vue", "Pinia", "Zustand", "Recoil", "Next.js", "Nuxt", "SSR", "TypeScript", "ESLint", "Vitest", "Playwright", "UnoCSS", "Ant Design", "AI Skills"];

const LOG_TITLE_OVERRIDES = {
  "2026-04-23": "React Router 与 Vue 生态依赖更新",
  "2026-04-29": "双模板依赖与工具链同步升级",
  "2026-05-04": "React / Vue 模板维护基线更新",
  "2026-05-12": "双模板依赖与开发工具升级",
  "2026-05-23": "React / Vue 依赖基线同步",
  "2026-06-02": "双模板依赖与工程工具升级",
  "2026-06-12": "React / Vue 工程基线升级",
  "2026-06-17": "React / Vue 企业级架构重构",
  "2026-06-23": "双模板依赖与验证基线升级",
  "2026-06-29": "React / Vue 质量基线升级",
  "2026-07-07": "Vite / TypeScript / 工具链升级",
  "2026-07-16": "四模板依赖与质量基线升级",
  "2026-07-22": "四模板生态兼容升级",
  "2026-07-28": "四模板统一 Node.js 24 LTS 基线",
  "2026-08-06": "四模板生态与工具链兼容升级",
  "2026-08-25": "四模板依赖与 SSR 兼容升级",
  "2026-09-03": "四模板依赖与工具链兼容升级",
  "2026-09-12": "四模板 Vitest 5 升级与兼容性治理",
  "2026-09-17": "四模板依赖、Node.js 与 SSR 安全基线升级",
};

// —— 工具函数（自 content.js 搬运）——

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) return { meta: {}, body: source };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const field = line.match(/^([\w-]+):\s*(.*)$/);
    if (!field) return;
    meta[field[1]] = field[2].trim().replace(/^['"]|['"]$/g, "");
  });
  return { meta, body: source.slice(match[0].length) };
}

function plainText(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_|~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTitle(body, meta, filename, date) {
  let heading = body.replace(/```[\s\S]*?```/g, "").match(/^#\s+(.+)$/m)?.[1];
  if (/^\d{4}-\d{2}-\d{2}$/.test(plainText(heading || ""))) {
    heading = LOG_TITLE_OVERRIDES[date] || `${plainText(heading)} 模板维护更新`;
  }
  const candidate = heading || meta.title || filename;
  return plainText(candidate).replace(/^[^\p{L}\p{N}]+/u, "") || filename;
}

function getSummary(body, title) {
  const clean = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<YouTubeVideo[^>]*\/>/g, "")
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\|.*\|$/gm, "")
    .replace(/^[-:|\s]+$/gm, "");
  const blocks = clean.split(/\n\s*\n/).map(plainText).filter((text) => text.length > 18 && text !== title);
  const summary = blocks[0] || `${title} 的版本说明、实现细节与升级记录。`;
  return summary.length > 118 ? `${summary.slice(0, 115)}...` : summary;
}

function classify(text) {
  return CATEGORY_RULES.find((rule) => rule.match.test(text)) || FALLBACK_CATEGORY;
}

function fmValue(value) {
  return typeof value === "string" || Array.isArray(value) ? JSON.stringify(value) : value;
}

// —— 主流程 ——

function collectTargets() {
  const targets = [];
  const add = (dir) => {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) return;
    for (const file of fs.readdirSync(abs)) {
      if (file.endsWith(".md")) targets.push(path.posix.join(dir, file));
    }
  };
  add("log");
  add("core");
  return targets;
}

const missingByFile = [];
const updated = [];

for (const rel of collectTargets()) {
  const abs = path.join(root, rel);
  const source = fs.readFileSync(abs, "utf8");
  const { meta, body } = parseFrontmatter(source);
  const isLog = rel.startsWith("log/");
  const filename = path.basename(rel, ".md");
  const date = filename.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";

  const metaTitle = typeof meta.title === "string" ? plainText(meta.title) : "";
  const metaTitleIsDate = /^\d{4}-\d{2}-\d{2}$/.test(metaTitle);
  const title = metaTitle && !metaTitleIsDate ? metaTitle : getTitle(body, meta, filename, date);
  const sourceText = `${title}\n${body}\n${JSON.stringify(meta)}`;
  const rule = CATEGORY_RULES.find((item) => item.match.test(title)) || classify(sourceText);
  const { category, kicker, accent, impact, visual } = rule;
  const metaKeywords = (meta.keywords || "").replace(/^\[|\]$/g, "").split(",").map((s) => s.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  const terms = KNOWN_TERMS.filter((term) => sourceText.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
  const keywords = [...new Set([...metaKeywords, ...terms, title, date].filter(Boolean))];
  const description = meta.description || getSummary(body, title);
  const readingTime = Math.max(1, Math.ceil(plainText(body).length / 500));

  const desired = { title, description, keywords, category, kicker, accent, visual, impact, readingTime };
  if (isLog && date) desired.date = date;

  const missing = Object.keys(desired).filter((key) => !(key in meta) || (key === "title" && metaTitleIsDate));
  if (missing.length === 0) continue;

  if (checkMode) {
    missingByFile.push(`${rel}: 缺 ${missing.join(", ")}`);
    continue;
  }

  // 幂等回填：已有 frontmatter 则在块尾追加缺失字段，否则在正文前新建块；
  // 裸日期 title 先移除旧行再追加修正后的 title
  let src = source;
  if (metaTitleIsDate && "title" in meta) {
    src = src.replace(/^title:[^\n]*\n/m, "");
  }
  const additions = missing.map((key) => `${key}: ${fmValue(desired[key])}`).join("\n");
  const fmMatch = src.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  let next;
  if (fmMatch) {
    next = `${src.slice(0, fmMatch[0].lastIndexOf("---"))}${additions}\n---\n${src.slice(fmMatch[0].length)}`;
  } else {
    next = `---\n${additions}\n---\n\n${src}`;
  }
  fs.writeFileSync(abs, next);
  updated.push(`${rel} (+${missing.length})`);
}

if (checkMode) {
  if (missingByFile.length) {
    console.error("frontmatter 缺字段（请运行 pnpm enrich 回填）：");
    for (const line of missingByFile) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log("frontmatter 检查通过");
} else {
  console.log(updated.length ? `已回填 ${updated.length} 个文件：\n  ${updated.join("\n  ")}` : "无需回填，全部字段已齐全");
}
