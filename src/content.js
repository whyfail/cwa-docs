import overviewRaw from "../index.md?raw";
import quickStartRaw from "../intro.md?raw";

const logModules = import.meta.glob("../log/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const coreModules = import.meta.glob("../core/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const imageModules = import.meta.glob("../log/img/*", {
  eager: true,
  query: "?url",
  import: "default",
});

export const assetUrls = new Map(Object.entries(imageModules));

const CATEGORY_RULES = [
  {
    match: /ai skills?|codex|agent|react grab|智能体|人工智能/i,
    category: "AI / DEVEX",
    kicker: "INTELLIGENT WORKFLOW",
    visual: "neuron",
    accent: "#efffa1",
    impact: "开发流程开始具备面向 AI Agent 的上下文、工具和协作边界。",
  },
  {
    match: /ssr|next\.js|nextjs|nuxt|服务端渲染/i,
    category: "ARCHITECTURE",
    kicker: "CLIENT / SERVER SYSTEM",
    visual: "attention",
    accent: "#b99cff",
    impact: "脚手架从 SPA 扩展到客户端与服务端协同的企业级应用架构。",
  },
  {
    match: /vitest|playwright|测试|质量门禁|coverage|typecheck/i,
    category: "QUALITY GATES",
    kicker: "VERIFY BEFORE SHIP",
    visual: "test",
    accent: "#bfffee",
    impact: "变更被更稳定的自动化验证覆盖，模板升级的回归风险随之降低。",
  },
  {
    match: /vite|rolldown|oxc|构建|压缩模式|hmr/i,
    category: "BUILD SYSTEM",
    kicker: "FASTER FEEDBACK LOOP",
    visual: "scaling",
    accent: "#45e8ff",
    impact: "构建内核与反馈链路持续提速，开发和交付成本进一步下降。",
  },
  {
    match: /react|zustand|recoil|antd|ant design|clsx/i,
    category: "REACT ECOSYSTEM",
    kicker: "REACT TEMPLATE EVOLUTION",
    visual: "backprop",
    accent: "#ff8eb9",
    impact: "React 模板的状态、组件与工程边界得到持续更新。",
  },
  {
    match: /vue|pinia|vue-hooks|volar/i,
    category: "VUE ECOSYSTEM",
    kicker: "VUE TEMPLATE EVOLUTION",
    visual: "perceptron",
    accent: "#7ef2d6",
    impact: "Vue 模板持续跟进生态能力，同时保持稳定的开发约定。",
  },
  {
    match: /unocss|postcss|pxtorem|css|图标|icon|样式/i,
    category: "UI / STYLING",
    kicker: "DESIGN TOOLCHAIN",
    visual: "vision",
    accent: "#ffd08a",
    impact: "样式与组件表达更加轻量、统一，并保持多端适配能力。",
  },
  {
    match: /eslint|prettier|git hook|simple-git-hooks|格式化|目录/i,
    category: "TOOLING",
    kicker: "CONSISTENT ENGINEERING",
    visual: "conference",
    accent: "#89dcff",
    impact: "团队开发规范被固化到工具链中，减少重复配置与协作偏差。",
  },
  {
    match: /路由|router|权限/i,
    category: "APPLICATION CORE",
    kicker: "RUNTIME FOUNDATION",
    visual: "attention",
    accent: "#9da8ff",
    impact: "应用运行时基础能力得到完善，业务接入路径更加清晰。",
  },
];

const FALLBACK_CATEGORY = {
  category: "PLATFORM UPDATE",
  kicker: "CREATE-WL-APP CHANGELOG",
  visual: "agents",
  accent: "#ffc95e",
  impact: "create-wl-app 的默认能力与使用体验得到一次可追溯的改进。",
};

const KNOWN_TERMS = [
  "Vite",
  "Rolldown",
  "Oxc",
  "React",
  "Vue",
  "Pinia",
  "Zustand",
  "Recoil",
  "Next.js",
  "Nuxt",
  "SSR",
  "TypeScript",
  "ESLint",
  "Vitest",
  "Playwright",
  "UnoCSS",
  "Ant Design",
  "AI Skills",
];

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
};

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) return { meta: {}, body: source };

  const meta = {};
  match[1].split("\n").forEach((line) => {
    const field = line.match(/^([\w-]+):\s*(.*)$/);
    if (!field) return;
    let value = field[2].trim();
    if (/^\[.*\]$/.test(value)) {
      value = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
    } else {
      value = value.replace(/^['"]|['"]$/g, "");
    }
    meta[field[1]] = value;
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

function getTitle(body, meta, fallback) {
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  let heading = withoutCode.match(/^#\s+(.+)$/m)?.[1];
  if (/^\d{4}-\d{2}-\d{2}$/.test(plainText(heading || ""))) {
    heading = LOG_TITLE_OVERRIDES[fallback] || `${plainText(heading)} 模板维护更新`;
  }
  const metaTitle = typeof meta.title === "string" ? meta.title : "";
  const candidate = heading || metaTitle || fallback;
  return plainText(candidate).replace(/^[^\p{L}\p{N}]+/u, "") || fallback;
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

function normalizePath(path) {
  return path.replace(/^\.\.\//, "").replace(/\.md$/, "");
}

function makeDocument(path, source, type, overrides = {}) {
  const { meta, body } = parseFrontmatter(source);
  const normalized = normalizePath(path);
  const filename = normalized.split("/").pop();
  const date = filename.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
  const title = overrides.title || getTitle(body, meta, filename);
  const sourceText = `${title}\n${body}\n${JSON.stringify(meta)}`;
  const category = CATEGORY_RULES.find((rule) => rule.match.test(title)) || classify(sourceText);
  const metaKeywords = [...(Array.isArray(meta.keywords) ? meta.keywords : []), ...(Array.isArray(meta.tags) ? meta.tags : [])];
  const terms = KNOWN_TERMS.filter((term) => sourceText.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
  const keywords = [...new Set([...metaKeywords, ...terms, title, date].filter(Boolean))];
  const headings = [...body.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => ({
    level: match[1].length,
    title: plainText(match[2].replace(/\s+\{#[^}]+\}$/, "")),
  }));
  const textLength = plainText(body).length;

  return {
    id: overrides.id || normalized,
    sourcePath: path,
    type,
    date,
    year: date.slice(0, 4) || (type === "core" ? "CORE" : "GUIDE"),
    title,
    titleEn: terms.slice(0, 3).join(" / ").toUpperCase() || category.category,
    category: category.category,
    kicker: category.kicker,
    description: overrides.description || getSummary(body, title),
    impact: category.impact,
    visual: category.visual,
    accent: category.accent,
    keywords,
    headings,
    readingTime: Math.max(1, Math.ceil(textLength / 500)),
    codeBlockCount: (body.match(/```/g)?.length || 0) / 2,
    body,
    meta,
  };
}

export const logs = Object.entries(logModules)
  .map(([path, source]) => makeDocument(path, source, "log"))
  .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

export const coreDocuments = Object.entries(coreModules)
  .map(([path, source]) => makeDocument(path, source, "core"))
  .sort((a, b) => Number(a.meta.sidebar_position || 99) - Number(b.meta.sidebar_position || 99));

export const guideDocuments = [
  makeDocument("guide/overview.md", overviewRaw, "guide", {
    id: "guide/overview",
    title: "create-wl-app 项目总览",
    description: "现代化前端脚手架的能力概览、适用场景与模板体系。",
  }),
  makeDocument("guide/quick-start.md", quickStartRaw, "guide", {
    id: "guide/quick-start",
  }),
];

export const documents = [...guideDocuments, ...coreDocuments, ...logs];
export const documentById = new Map(documents.map((document) => [document.id, document]));

export function resolveDocumentId(value = "") {
  let id = decodeURIComponent(value)
    .replace(/^#?\/?docs\//, "")
    .replace(/^\/cwa-docs\//, "")
    .replace(/^\//, "")
    .split(/[?#]/)[0]
    .replace(/\.md$/, "");
  if (id === "intro") id = "guide/quick-start";
  if (!id || id === "index") id = "guide/overview";
  return documentById.has(id) ? id : null;
}
