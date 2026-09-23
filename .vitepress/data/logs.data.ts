import { createContentLoader } from "vitepress";

export interface LogEntry {
  url: string;
  title: string;
  date: string;
  description: string;
  category: string;
  kicker: string;
  accent: string;
  visual: string;
  impact: string;
  readingTime: number;
  keywords: string[];
}

export default createContentLoader("log/*.md", {
  transform: (raw): LogEntry[] =>
    raw
      .filter((item) => item.frontmatter.date)
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title || url,
        // 未加引号的 YAML 日期会被解析成 Date 对象，统一规范化为 YYYY-MM-DD
        date:
          frontmatter.date instanceof Date
            ? frontmatter.date.toISOString().slice(0, 10)
            : String(frontmatter.date || ""),
        description: frontmatter.description || "",
        category: frontmatter.category || "PLATFORM UPDATE",
        kicker: frontmatter.kicker || "CREATE-WL-APP CHANGELOG",
        accent: frontmatter.accent || "#ffc95e",
        visual: frontmatter.visual || "agents",
        impact: frontmatter.impact || "",
        readingTime: Number(frontmatter.readingTime || 1),
        keywords: Array.isArray(frontmatter.keywords) ? frontmatter.keywords : [],
      }))
      .sort((a, b) => b.date.localeCompare(a.date) || b.url.localeCompare(a.url)),
});
