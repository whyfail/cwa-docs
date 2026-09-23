import fs from "node:fs";
import path from "node:path";
import { defineConfig, type HeadConfig } from "vitepress";
import { RssPlugin } from "vitepress-plugin-rss";
import { generateSidebar } from "./sidebar.mjs";

/** 线上固定地址（GitHub Pages，base 为 /cwa-docs/），canonical / og / sitemap / llms 共用 */
const ORIGIN = "https://whyfail.github.io";
const HOSTNAME = `${ORIGIN}/cwa-docs`;
const SITE_NAME = "cwa-stack";
const SITE_DESC = "cwa-stack 交互式升级日志与开发文档";

/** 中文 bigram 分词：索引端（Node）与查询端（浏览器）共用，函数体内不得引用外部变量（会被 toString 序列化） */
function tokenize(text: string): string[] {
  const out: string[] = [];
  const segments = text.toLowerCase().match(/[\u4e00-\u9fff]+|[\p{L}\p{N}]+/gu) ?? [];
  for (const segment of segments) {
    if (segment.length > 1 && /[\u4e00-\u9fff]/.test(segment)) {
      for (let i = 0; i < segment.length - 1; i += 1) out.push(segment.slice(i, i + 2));
    }
    out.push(segment);
  }
  return out;
}

/** 页面路由路径：'log/2026-09-21.md' → '/log/2026-09-21'，'index.md' → '/' */
function routeOf(relativePath: string): string {
  return "/" + relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
}

function readFrontmatterTitle(source: string): { title?: string; description?: string } {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  const title = match[1].match(/^title:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, "");
  const description = match[1].match(/^description:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, "");
  return { title, description };
}

export default defineConfig({
  lang: "zh-CN",
  title: SITE_NAME,
  description: SITE_DESC,
  base: process.env.GITHUB_ACTIONS ? "/cwa-docs/" : "/",
  /** vite.dev 风格：亮色为默认主题，用户手动切换后仍记忆在 localStorage（维护者推荐用法，见 vuejs/vitepress#3957） */
  appearance: {
    // @ts-expect-error initialValue 类型暂只声明了 'dark'，运行时与防闪烁内联脚本均支持 'light'
    initialValue: "light",
  },
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ["README.md"],
  sitemap: {
    hostname: HOSTNAME,
    transformItems: (items) =>
      items.map((item) => ({
        ...item,
        url: item.url.startsWith("/") ? `${HOSTNAME}${item.url}` : `${HOSTNAME}/${item.url}`,
      })),
  },

  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["meta", { name: "theme-color", content: "#6c3bff" }],
    ["meta", { property: "og:site_name", content: `${SITE_NAME} Upgrade Log` }],
    ["meta", { property: "og:image", content: `${HOSTNAME}/logo.png` }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    [
      "link",
      { rel: "alternate", type: "application/rss+xml", href: `${HOSTNAME}/feed.rss`, title: `${SITE_NAME} 演进日志` },
    ],
  ],

  /** 每页 OG / canonical / JSON-LD / keywords（GEO 核心），构建期注入静态 HTML head */
  transformHead({ pageData, description }) {
    const route = routeOf(pageData.relativePath);
    const canonical = route === "/" ? `${HOSTNAME}/` : `${HOSTNAME}${route}`;
    const fm = pageData.frontmatter;
    const pageDesc: string = description || SITE_DESC;
    const isLog = Boolean(fm.date) && pageData.relativePath.startsWith("log/");
    const isHome = route === "/";

    const head: HeadConfig[] = [
      ["link", { rel: "canonical", href: canonical }],
      ["meta", { property: "og:type", content: isLog ? "article" : "website" }],
      ["meta", { property: "og:title", content: pageData.title }],
      ["meta", { property: "og:description", content: pageDesc }],
      ["meta", { property: "og:url", content: canonical }],
    ];
    if (Array.isArray(fm.keywords) && fm.keywords.length) {
      head.push(["meta", { name: "keywords", content: fm.keywords.join(", ") }]);
    }

    let jsonLd: Record<string, unknown>;
    if (isHome) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${HOSTNAME}/`,
        description: SITE_DESC,
        inLanguage: "zh-CN",
      };
    } else if (isLog) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: pageData.title,
        description: pageDesc,
        datePublished: fm.date,
        dateModified: (pageData.lastUpdated && new Date(pageData.lastUpdated).toISOString()) || fm.date,
        keywords: Array.isArray(fm.keywords) ? fm.keywords.join(", ") : undefined,
        author: { "@type": "Person", name: "WuLei" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: `${ORIGIN}/whyfail` },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        inLanguage: "zh-CN",
        timeRequired: `PT${fm.readingTime || 1}M`,
      };
    } else {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: pageData.title,
        description: pageDesc,
        author: { "@type": "Person", name: "WuLei" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: `${ORIGIN}/whyfail` },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        inLanguage: "zh-CN",
      };
    }
    head.push(["script", { type: "application/ld+json" }, JSON.stringify(jsonLd)]);

    return head;
  },

  /** 构建后：复制 md 原文（URL+.md 可读）+ 生成 llms.txt / llms-full.txt */
  async buildEnd(siteConfig) {
    const outDir: string = siteConfig.outDir;
    const pages: string[] = siteConfig.pages.filter((page) => page !== "README.md");
    const llmsIndex: string[] = [`# ${SITE_NAME} 文档`, `> ${SITE_DESC}`, ""];
    const llmsFull: string[] = [];

    for (const page of pages) {
      const src = path.join(siteConfig.srcDir, page);
      if (!fs.existsSync(src)) continue;
      const source = fs.readFileSync(src, "utf8");
      const dest = path.join(outDir, page);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, source); // URL + .md 直出原文

      const route = routeOf(page);
      const url = route === "/" ? `${HOSTNAME}/` : `${HOSTNAME}${route}`;
      const { title, description } = readFrontmatterTitle(source);
      const heading = title || path.basename(page, ".md");
      if (route !== "/") {
        llmsIndex.push(`- [${heading}](${url}.md)${description ? `: ${description}` : ""}`);
      }
      llmsFull.push(`## ${heading}\n\n来源: ${url}\n\n${source}\n`);
    }

    fs.writeFileSync(path.join(outDir, "llms.txt"), llmsIndex.join("\n"));
    fs.writeFileSync(path.join(outDir, "llms-full.txt"), llmsFull.join("\n"));
  },

  vite: {
    plugins: [
      RssPlugin({
        title: `${SITE_NAME} 演进日志`,
        description: SITE_DESC,
        baseUrl: ORIGIN, // 插件自动追加 site.base（/cwa-docs/）
        copyright: "Copyright (c) 2023-present, WuLei",
        author: { name: "WuLei", link: `${ORIGIN}/whyfail` },
        filename: "feed.rss",
        icon: false,
        filter: (post) => post.filepath.replace(/\\/g, "/").includes("/log/"),
      }),
    ],
  },

  themeConfig: {
    search: {
      provider: "local",
      options: { miniSearch: { options: { tokenize } } },
    },
    outline: [2, 3],
    logo: "/logo.png",
    footer: {
      message: "cwa-stack —— 开箱即用，极速响应，让开发更简单、更高效",
      copyright: "Copyright © 2023-present, WuLei",
    },
    nav: [
      { text: "快速开始", link: "/intro" },
      { text: "模板文档", link: "/core/脚手架核心" },
      { text: "升级日志", link: "/archive" },
      { text: "GitHub", link: "https://github.com/whyfail/cwa-stack" },
    ],
    sidebar: generateSidebar(),
    socialLinks: [
      { icon: "github", link: "https://github.com/whyfail/cwa-stack" },
      { icon: "npm", link: "https://www.npmjs.com/package/cwa-stack" },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gitee</title><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>',
        },
        link: "https://gitee.com/whyfail",
      },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>CSDN</title><path d="M4.693 13.638c-.497.568-1.363.63-1.712.63-.648 0-1.144-.164-1.474-.488-.313-.307-.478-.76-.489-1.346-.025-1.358.744-2.762 2.074-2.762.635 0 1.124.455 1.311.644a.337.337 0 0 0 .282.099.38.38 0 0 0 .241-.159c.068-.087.135-.237.138-.401s-.057-.344-.243-.49a2.642 2.642 0 0 0-1.668-.591c-.819 0-1.627.376-2.218 1.033-.621.691-.953 1.63-.935 2.646.015.815.282 1.5.773 1.982.528.518 1.3.791 2.235.791 1.097 0 1.776-.325 2.154-.597a.584.584 0 0 0 .24-.456.702.702 0 0 0-.208-.497c-.23-.248-.448-.101-.503-.037ZM9.663 11.488a7.471 7.471 0 0 0-.698-.248c-.157-.048-.309-.091-.45-.131-.922-.26-1.027-.5-1.017-.68.022-.363.515-.853 1.352-.792.607.045 1.015.509 1.205.781.149.214.371.135.434.095a.602.602 0 0 0 .309-.514.626.626 0 0 0-.209-.488 2.654 2.654 0 0 0-3.347-.273c-.456.323-.744.772-.77 1.202-.064 1.061 1.015 1.366 1.803 1.588.214.061.429.127.667.202 1.14.357 1.173.717 1.092 1.267-.082.556-.696.834-1.685.761-1.029-.076-1.464-.61-1.612-.901-.05-.098-.205-.248-.413-.156-.514.229-.473.731-.26.993.339.416 1.15 1.035 2.667 1.035 1.734 0 2.255-.875 2.378-1.64.092-.572-.022-1.028-.348-1.396-.236-.267-.592-.495-1.101-.706ZM16.44 9.323c-.598-.431-1.393-.61-2.36-.532-.712.058-1.274.243-1.335.263l-.006.002a.437.437 0 0 0-.297.379l-.47 5.201a.337.337 0 0 0 .247.35l.072.02.066.018.086.021a7.914 7.914 0 0 0 1.64.183c.972 0 1.765-.23 2.36-.684.764-.583 1.141-1.5 1.118-2.725-.021-1.135-.398-1.974-1.121-2.495Zm-.662 4.461c-.836.639-2.09.562-2.677.481a.128.128 0 0 1-.109-.137l.397-4.248a.113.113 0 0 1 .086-.1c.999-.241 1.777-.168 2.312.218.189.137.348.331.471.568.176.339.277.765.286 1.234.017.916-.24 1.583-.765 1.984ZM23.967 10.41a1.92 1.92 0 0 0-.432-.919c-.399-.465-1.029-.689-1.848-.689-.734 0-1.372.228-1.947.799.007-.086.019-.159.018-.223s-.017-.116-.066-.163c-.048-.045-.077-.067-.127-.077-.05-.01-.122-.008-.256-.006a.587.587 0 0 0-.589.54s-.325 3.874-.428 5.165a.308.308 0 0 0 .073.228.36.36 0 0 0 .26.131h.387a.224.224 0 0 0 .226-.205l.273-2.929.014-.147a1.902 1.902 0 0 1 .082-.412c.014-.045.03-.092.047-.14.245-.694.803-1.72 1.971-1.694.84.018 1.449.455 1.385 1.114-.101 1.034-.266 3.1-.358 4.14-.019.209.182.273.252.273h.304a.442.442 0 0 0 .444-.404s.185-2.127.294-3.352l.048-.532a1.959 1.959 0 0 0-.026-.5Z"/></svg>',
        },
        link: "https://why404.blog.csdn.net/",
      },
      { icon: "rss", link: `${HOSTNAME}/feed.rss` },
    ],
    editLink: {
      pattern: "https://github.com/whyfail/cwa-docs/edit/master/:path",
      text: "在 GitHub 上编辑此页",
    },
    lastUpdated: { text: "最后更新于" },
    docFooter: { prev: "上一篇", next: "下一篇" },
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    langMenuLabel: "切换语言",
  },
});
