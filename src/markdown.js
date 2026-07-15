import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { assetUrls, resolveDocumentId } from "./content.js";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("jsx", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("tsx", typescript);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("vue", xml);

export function slugify(value) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+\{#[^}]+\}$/, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeAssetPath(sourcePath, url) {
  if (/^(?:https?:|data:)/.test(url)) return url;
  const base = sourcePath.slice(0, sourcePath.lastIndexOf("/") + 1);
  const parts = `${base}${url}`.split("/");
  const normalized = [];
  parts.forEach((part) => {
    if (!part || part === ".") return;
    if (part === "..") normalized.pop();
    else normalized.push(part);
  });
  const key = `../${normalized.join("/")}`;
  return assetUrls.get(key) || url;
}

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      return `<pre class="hljs"><code>${hljs.highlight(code, { language, ignoreIllegals: true }).value}</code></pre>`;
    }
    return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`;
  },
}).use(markdownItAnchor, {
  slugify,
});

const defaultImageRenderer = markdown.renderer.rules.image;
markdown.renderer.rules.image = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const srcIndex = token.attrIndex("src");
  if (srcIndex >= 0) token.attrs[srcIndex][1] = normalizeAssetPath(env.sourcePath || "", token.attrs[srcIndex][1]);
  token.attrSet("loading", "lazy");
  return defaultImageRenderer(tokens, index, options, env, self);
};

const defaultLinkOpen = markdown.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const hrefIndex = token.attrIndex("href");
  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1];
    const documentId = resolveDocumentId(href);
    if (documentId) {
      token.attrs[hrefIndex][1] = `#/docs/${encodeURI(documentId)}`;
    } else if (/^https?:/.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noreferrer");
    }
  }
  return defaultLinkOpen(tokens, index, options, env, self);
};

export function renderMarkdown(document) {
  const source = document.body
    .replace(/^#\s+.*(?:\n|$)/m, "")
    .replace(/^(#{1,6}\s+.*?)\s+\{#[^}]+\}\s*$/gm, "$1")
    .replace(
    /<YouTubeVideo\s+videoId=["']([^"']+)["']\s*\/>/g,
    (_, videoId) => `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`,
    );
  return markdown.render(source, { sourcePath: document.sourcePath, documentId: document.id });
}
