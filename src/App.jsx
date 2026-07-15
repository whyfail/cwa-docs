import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock3,
  Code2,
  ListFilter,
  Menu,
  Search,
  X,
} from "lucide-react";
import { coreDocuments, documentById, documents, guideDocuments, logs, resolveDocumentId } from "./content.js";
import { renderMarkdown, slugify } from "./markdown.js";
import { EraVisual } from "./EraVisual.jsx";
import { NeuralField } from "./NeuralField.jsx";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const pad = (value) => String(value + 1).padStart(2, "0");
const HOME_SECTIONS = [
  { id: "guide", label: "指南" },
  { id: "core", label: "核心文档" },
  { id: "log", label: "更新日志" },
];
const DOCUMENT_COLLECTIONS = {
  guide: guideDocuments,
  core: coreDocuments,
  log: logs,
};

function ScrambleText({ text, delay = 0, duration = 720, active = true }) {
  const [display, setDisplay] = useState(active ? "" : text);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return undefined;
    }
    let raf = 0;
    let startTime = 0;
    const glyphs = "0123456789ABCDEF";
    const punctuation = /[\s/,.!?，。；：—→←()（）]/;
    const tick = (now) => {
      if (!startTime) startTime = now + delay;
      if (now < startTime) {
        setDisplay("");
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = clamp((now - startTime) / duration, 0, 1);
      const revealed = Math.floor(text.length * (1 - Math.pow(1 - progress, 3)));
      setDisplay(text.split("").map((character, index) => {
        if (index < revealed || punctuation.test(character)) return character;
        return glyphs[(index * 7 + Math.floor(now / 42)) % glyphs.length];
      }).join(""));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, delay, duration, text]);

  return <span>{display}</span>;
}

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.5;
    let ringX = x;
    let ringY = y;
    let raf = 0;
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.dataset.hover = event.target.closest("button, a, input") ? "true" : "false";
    };
    const onDown = () => ring.setAttribute("data-down", "true");
    const onUp = () => ring.setAttribute("data-down", "false");
    const render = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(render);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

function Intro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const finish = useCallback(() => {
    if (leaving) return;
    setProgress(100);
    setLeaving(true);
    window.setTimeout(onComplete, 700);
  }, [leaving, onComplete]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const run = (now) => {
      const elapsed = now - start;
      setProgress(Math.min(100, Math.round((elapsed / 1900) * 100)));
      if (elapsed < 1900) raf = requestAnimationFrame(run);
      else finish();
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  return (
    <button className={`intro ${leaving ? "is-leaving" : ""}`} type="button" onClick={finish} aria-label="跳过载入动画">
      <div className="intro__grid" />
      <div className="intro__topline"><span>CWA / EVOLUTION ARCHIVE</span><span>CN—01</span></div>
      <div className="intro__center">
        <p>INDEXING PROJECT MEMORY</p>
        <strong>{String(progress).padStart(3, "0")}</strong>
        <div className="intro__bar"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="intro__footer"><span>{documents.length} DOCUMENT NODES</span><span>ARCHIVE READY</span></div>
    </button>
  );
}

function EraCard({ era, index, progress, onSelect, viewport, total }) {
  const relative = index - progress;
  const mobile = viewport.width < 720;
  const angle = relative * (mobile ? 0.76 : 0.82);
  const radius = mobile ? Math.min(viewport.width * 0.52, 205) : clamp(viewport.width * 0.34, 320, 540);
  const x = Math.sin(angle) * radius;
  const y = relative * (mobile ? 82 : 58) + Math.sin(angle * 0.6) * (mobile ? 16 : 34);
  const depth = Math.cos(angle);
  const z = depth * (mobile ? 180 : 310) - Math.abs(relative) * 18;
  const scale = (0.55 + ((depth + 1) / 2) * 0.5) * clamp(1 - Math.abs(relative) * 0.025, 0.76, 1);
  const opacity = clamp(1 - Math.max(0, Math.abs(relative) - 2.2) / 2.5, 0, 1);
  const blur = clamp(Math.abs(relative) - 0.35, 0, 4) * 0.48;
  const isActive = Math.abs(relative) < 0.5;
  const interactive = Math.abs(relative) < 2.6;

  return (
    <button
      type="button"
      className={`era-card ${isActive ? "is-active" : ""}`}
      style={{
        "--accent": era.accent,
        "--card-opacity": opacity,
        "--card-blur": `${blur}px`,
        zIndex: Math.round((depth + 1) * 100 - Math.abs(relative) * 4),
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${-Math.sin(angle) * (mobile ? 28 : 38)}deg) rotateZ(${-relative * (mobile ? 0.7 : 1.1)}deg) scale(${scale})`,
      }}
      onClick={() => interactive && onSelect(index, isActive)}
      tabIndex={isActive ? 0 : -1}
      aria-label={`${era.date || era.year} ${era.title}。${isActive ? "打开摘要" : "跳转到此文档"}`}
    >
      <div className="era-card__surface">
        <EraVisual mode={era.visual} accent={era.accent} seed={index + 1} active={isActive} />
        <div className="era-card__chromatic" />
        <div className="era-card__noise" />
        <div className="era-card__head"><span>{pad(index)} / {String(total).padStart(2, "0")}</span><span>{era.category}</span></div>
        <div className="era-card__year">{era.year}</div>
        <div className="era-card__copy"><p>{era.date || era.category}</p><h2>{era.title}</h2><div className="era-card__en">{era.titleEn}</div></div>
        <div className="era-card__open"><span>{isActive ? "OPEN DOCUMENT" : "SEEK DOCUMENT"}</span><span>DETAIL</span></div>
      </div>
    </button>
  );
}

function DetailView({ era, index, onClose, onPrevious, onNext, onRead, total, inactive = false }) {
  const metaLabel = era.date || era.year;
  return (
    <section className="detail-view" style={{ "--accent": era.accent }} aria-label={`${metaLabel} ${era.title} 摘要`} inert={inactive}>
      <div className="detail-view__halo" />
      <button type="button" className="detail-view__stage" onClick={onRead} aria-label={`阅读 ${era.title}`}>
        <div className="detail-cube">
          <div className="detail-cube__face">
            <EraVisual mode={era.visual} accent={era.accent} seed={index + 31} active detail />
            <div className="detail-cube__wash" />
            <div className="detail-cube__meta"><span>DOCUMENT {pad(index)}</span><span>{era.category}</span></div>
            <div className="detail-cube__year">{era.year}</div>
            <div className="detail-cube__title"><small>{metaLabel} / {era.kicker}</small><strong>{era.titleEn}</strong></div>
          </div>
          <div className="detail-cube__edge detail-cube__edge--top" />
          <div className="detail-cube__edge detail-cube__edge--right" />
        </div>
      </button>
      <div className="detail-copy" key={era.id}>
        <p className="detail-copy__eyebrow"><ScrambleText text={`${metaLabel} / ${era.category}`} delay={100} /></p>
        <h1><ScrambleText text={era.title} delay={220} duration={760} /></h1>
        <p className="detail-copy__body"><ScrambleText text={era.description} delay={420} duration={1100} /></p>
        <p className="detail-copy__impact"><ScrambleText text={era.impact} delay={780} duration={760} /></p>
        <div className="detail-stats"><span><Clock3 size={13} /> {era.readingTime} MIN</span><span><Code2 size={13} /> {era.codeBlockCount} BLOCKS</span></div>
        <div className="detail-copy__actions">
          <button type="button" onClick={onRead}><BookOpen size={14} /> READ DOCUMENT</button>
          <button type="button" onClick={onClose} autoFocus><ArrowLeft size={14} /> CLOSE</button>
        </div>
      </div>
      <div className="detail-nav">
        <button type="button" onClick={onPrevious} aria-label="上一个文档"><ArrowLeft size={14} /> PREV</button>
        <span>{pad(index)} / {String(total).padStart(2, "0")}</span>
        <button type="button" onClick={onNext} aria-label="下一个文档">NEXT <ArrowRight size={14} /></button>
      </div>
    </section>
  );
}

function ArchiveOverlay({ activeDocumentId, onClose, onSelectDocument }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return documents.filter((document) => {
      if (scope !== "all" && document.type !== scope) return false;
      if (!normalized) return true;
      return [document.title, document.date, document.category, document.description, ...document.keywords]
        .join(" ").toLocaleLowerCase().includes(normalized);
    });
  }, [query, scope]);

  return (
    <section className="archive-overlay" aria-label="create-wl-app 文档索引">
      <div className="archive-overlay__head">
        <div><p>CWA / PROJECT MEMORY</p><h2>演进档案与文档</h2></div>
        <button type="button" onClick={onClose} autoFocus><X size={16} /> CLOSE</button>
      </div>
      <div className="archive-toolbar">
        <label><Search size={15} /><span className="sr-only">搜索全部文档</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索版本、技术或主题" /></label>
        <div className="archive-scopes" aria-label="文档类型">
          {[{ id: "all", label: "全部" }, { id: "log", label: "更新日志" }, { id: "core", label: "核心文档" }, { id: "guide", label: "指南" }].map((item) => (
            <button key={item.id} type="button" className={scope === item.id ? "is-active" : ""} onClick={() => setScope(item.id)}>{item.label}</button>
          ))}
        </div>
      </div>
      <div className="archive-list">
        {filtered.map((document) => {
          const logIndex = document.type === "log" ? logs.findIndex((item) => item.id === document.id) : -1;
          return (
            <button
              type="button"
              key={document.id}
              className={document.id === activeDocumentId ? "is-active" : ""}
              style={{ "--accent": document.accent }}
              onClick={() => onSelectDocument(document)}
            >
              <span>{document.type === "log" ? pad(logIndex) : "DOC"}</span>
              <strong>{document.year}</strong>
              <div><p>{document.title}</p><small>{document.date || document.category}</small></div>
              <em>{document.category}</em>
            </button>
          );
        })}
        {!filtered.length && <div className="archive-empty">没有匹配的文档</div>}
      </div>
      <div className="archive-overlay__foot"><span>{filtered.length} DOCUMENTS INDEXED</span><span>2023 — 2026</span></div>
    </section>
  );
}

function SearchConsole({ onSearch, status, placeholder }) {
  const [value, setValue] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
    setValue("");
  };
  return (
    <form className="search-console" onSubmit={submit}>
      <div className="search-console__status" aria-live="polite">{status}</div>
      <div className="search-console__field">
        <label><span className="sr-only">搜索当前分类文档</span><input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} maxLength={50} /><i /></label>
        <button type="submit" aria-label="搜索"><Search size={14} /></button>
      </div>
    </form>
  );
}

function getRouteDocument() {
  if (!window.location.hash.startsWith("#/docs/")) return null;
  return resolveDocumentId(window.location.hash);
}

function navigateToDocument(document) {
  window.location.hash = `/docs/${encodeURI(document.id)}`;
}

function DocumentReader({ document, onTimeline }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const articleRef = useRef(null);
  const html = useMemo(() => renderMarkdown(document), [document]);
  const collection = document.type === "log" ? logs : document.type === "core" ? coreDocuments : guideDocuments;
  const currentIndex = collection.findIndex((item) => item.id === document.id);
  const previous = collection[currentIndex - 1] || null;
  const next = collection[currentIndex + 1] || null;
  const groupedLogs = useMemo(() => {
    const groups = new Map();
    logs.forEach((item) => {
      if (!groups.has(item.year)) groups.set(item.year, []);
      groups.get(item.year).push(item);
    });
    return Array.from(groups, ([year, items]) => ({ year, items }));
  }, []);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = (item) => !normalizedQuery || `${item.title} ${item.date} ${item.category}`.toLocaleLowerCase().includes(normalizedQuery);

  useEffect(() => {
    globalThis.document.title = `${document.title} / create-wl-app`;
    articleRef.current?.scrollTo({ top: 0 });
    setMenuOpen(false);
  }, [document]);

  const open = (target) => navigateToDocument(target);
  return (
    <main className="reader" style={{ "--accent": document.accent }}>
      <header className="reader-topbar">
        <button type="button" className="reader-brand" onClick={onTimeline}><ArrowLeft size={16} /><span>CWA / EVOLUTION</span></button>
        <div className="reader-path"><span>{document.type.toUpperCase()}</span><ChevronRight size={13} /><strong>{document.title}</strong></div>
        <button type="button" className="reader-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="打开文档目录"><Menu size={18} /></button>
      </header>

      <aside className={`reader-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="reader-sidebar__search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文档" /></div>
        <nav aria-label="文档目录">
          <section><h2>开始</h2>{guideDocuments.filter(matches).map((item) => <button type="button" key={item.id} className={item.id === document.id ? "is-active" : ""} onClick={() => open(item)}>{item.title}</button>)}</section>
          <section><h2>核心能力</h2>{coreDocuments.filter(matches).map((item) => <button type="button" key={item.id} className={item.id === document.id ? "is-active" : ""} onClick={() => open(item)}>{item.title}</button>)}</section>
          {groupedLogs.map(({ year, items }) => {
            const visible = items.filter(matches);
            if (!visible.length) return null;
            return <section key={year}><h2>{year} 更新</h2>{visible.map((item) => <button type="button" key={item.id} className={item.id === document.id ? "is-active" : ""} onClick={() => open(item)}><span>{item.date.slice(5)}</span>{item.title}</button>)}</section>;
          })}
        </nav>
      </aside>
      {menuOpen && <button className="reader-sidebar-backdrop" type="button" onClick={() => setMenuOpen(false)} aria-label="关闭文档目录" />}

      <div className="reader-scroll" ref={articleRef}>
        <article className="doc-article">
          <div className="doc-article__meta"><span>{document.date || "PROJECT GUIDE"}</span><span>{document.category}</span></div>
          <h1>{document.title}</h1>
          <p className="doc-article__lead">{document.description}</p>
          <div className="doc-article__stats"><span><Clock3 size={14} /> {document.readingTime} 分钟阅读</span><span><Code2 size={14} /> {document.codeBlockCount} 个代码块</span></div>
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
          <footer className="doc-pagination">
            {previous ? <button type="button" onClick={() => open(previous)}><ArrowLeft size={16} /><span><small>上一篇</small>{previous.title}</span></button> : <span />}
            {next ? <button type="button" onClick={() => open(next)}><span><small>下一篇</small>{next.title}</span><ArrowRight size={16} /></button> : <span />}
          </footer>
        </article>
      </div>

      {document.headings.length > 0 && (
        <aside className="reader-outline">
          <p>ON THIS PAGE</p>
          <nav>{document.headings.slice(0, 14).map((heading, index) => <a key={`${heading.title}-${heading.level}-${index}`} className={`level-${heading.level}`} href={`#${slugify(heading.title)}`} onClick={(event) => { event.preventDefault(); globalThis.document.getElementById(slugify(heading.title))?.scrollIntoView({ behavior: "smooth" }); }}>{heading.title}</a>)}</nav>
        </aside>
      )}
      <Cursor />
    </main>
  );
}

export function App() {
  const qaMode = useMemo(() => new URLSearchParams(window.location.search).has("qa"), []);
  const [routeDocumentId, setRouteDocumentId] = useState(getRouteDocument);
  const [ready, setReady] = useState(qaMode || Boolean(routeDocumentId));
  const [section, setSection] = useState("guide");
  const [visualProgress, setVisualProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailIndex, setDetailIndex] = useState(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [searchStatus, setSearchStatus] = useState("SEARCH CURRENT COLLECTION");
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const activeDocuments = DOCUMENT_COLLECTIONS[section];
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const detailRef = useRef(null);
  const archiveRef = useRef(false);
  const pointerStartRef = useRef(null);
  const timersRef = useRef([]);
  detailRef.current = detailIndex;
  archiveRef.current = archiveOpen;

  useEffect(() => {
    const onHashChange = () => setRouteDocumentId(getRouteDocument());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => () => timersRef.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const animate = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const current = progressRef.current;
      const next = current + (targetRef.current - current) * (1 - Math.pow(0.0007, dt));
      progressRef.current = Math.abs(targetRef.current - next) < 0.0005 ? targetRef.current : next;
      setVisualProgress(progressRef.current);
      const nextActive = clamp(Math.round(progressRef.current), 0, activeDocuments.length - 1);
      setActiveIndex((previous) => previous === nextActive ? previous : nextActive);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [activeDocuments.length]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const activateSection = useCallback((nextSection, index = 0) => {
    const collection = DOCUMENT_COLLECTIONS[nextSection];
    const nextIndex = clamp(index, 0, collection.length - 1);
    clearTimers();
    setSection(nextSection);
    setDetailIndex(null);
    setArchiveOpen(false);
    setTransitioning(false);
    progressRef.current = nextIndex;
    targetRef.current = nextIndex;
    setVisualProgress(nextIndex);
    setActiveIndex(nextIndex);
    setSearchStatus(`${collection.length} DOCUMENTS / ${nextSection.toUpperCase()}`);
  }, [clearTimers]);

  const jumpTo = useCallback((index) => {
    const next = clamp(index, 0, activeDocuments.length - 1);
    targetRef.current = next;
    setArchiveOpen(false);
    setSearchStatus(`DOCUMENT ${pad(next)} / ${(activeDocuments[next].date || activeDocuments[next].year).toUpperCase()} ACQUIRED`);
  }, [activeDocuments]);

  const focusDocument = useCallback((document) => {
    const collection = DOCUMENT_COLLECTIONS[document.type];
    const index = collection.findIndex((item) => item.id === document.id);
    activateSection(document.type, Math.max(0, index));
  }, [activateSection]);

  const openDetail = useCallback((index, immediate = false) => {
    if (!ready || transitioning) return;
    if (!immediate && Math.abs(progressRef.current - index) > 0.28) {
      jumpTo(index);
      timersRef.current.push(window.setTimeout(() => openDetail(index, true), 440));
      return;
    }
    clearTimers();
    setTransitioning(true);
    timersRef.current.push(window.setTimeout(() => setDetailIndex(index), 150));
    timersRef.current.push(window.setTimeout(() => setTransitioning(false), 1250));
  }, [clearTimers, jumpTo, ready, transitioning]);

  const closeDetail = useCallback(() => {
    if (transitioning) return;
    clearTimers();
    setTransitioning(true);
    timersRef.current.push(window.setTimeout(() => setDetailIndex(null), 140));
    timersRef.current.push(window.setTimeout(() => setTransitioning(false), 850));
  }, [clearTimers, transitioning]);

  const shiftDetail = useCallback((direction) => {
    const current = detailRef.current ?? activeIndex;
    const next = (current + direction + activeDocuments.length) % activeDocuments.length;
    clearTimers();
    setTransitioning(true);
    targetRef.current = next;
    timersRef.current.push(window.setTimeout(() => setDetailIndex(next), 170));
    timersRef.current.push(window.setTimeout(() => setTransitioning(false), 950));
  }, [activeDocuments.length, activeIndex, clearTimers]);

  useEffect(() => {
    const onWheel = (event) => {
      if (!ready || routeDocumentId) return;
      if (detailRef.current != null || archiveRef.current) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      targetRef.current = clamp(targetRef.current + clamp(event.deltaY, -160, 160) * 0.00215, 0, activeDocuments.length - 1);
    };
    const onKeyDown = (event) => {
      if (routeDocumentId) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        if (event.key === "Escape") event.target.blur();
        return;
      }
      if (event.key === "Escape") {
        if (archiveRef.current) setArchiveOpen(false);
        else if (detailRef.current != null) closeDetail();
        return;
      }
      if (archiveRef.current) return;
      if (detailRef.current != null) {
        if (event.key === "ArrowLeft") shiftDetail(-1);
        if (event.key === "ArrowRight") shiftDetail(1);
        return;
      }
      if (["ArrowDown", "PageDown", "ArrowRight"].includes(event.key)) targetRef.current = clamp(Math.round(targetRef.current) + 1, 0, activeDocuments.length - 1);
      if (["ArrowUp", "PageUp", "ArrowLeft"].includes(event.key)) targetRef.current = clamp(Math.round(targetRef.current) - 1, 0, activeDocuments.length - 1);
      if (["Enter", " "].includes(event.key)) openDetail(activeIndex, true);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeDocuments.length, activeIndex, closeDetail, openDetail, ready, routeDocumentId, shiftDetail]);

  const routeDocument = routeDocumentId ? documentById.get(routeDocumentId) : null;
  if (routeDocument) {
    return <DocumentReader document={routeDocument} onTimeline={() => { window.location.hash = "/"; document.title = "create-wl-app / Evolution Archive"; }} />;
  }

  const activeEra = activeDocuments[activeIndex];
  const detailEra = detailIndex == null ? null : activeDocuments[detailIndex];
  const accent = detailEra?.accent ?? activeEra.accent;
  const progressPercent = activeDocuments.length > 1 ? (visualProgress / (activeDocuments.length - 1)) * 100 : 100;
  const sectionStatus = section === "log" ? "2026—2023" : `${activeDocuments.length} ${section === "guide" ? "GUIDES" : "CORE DOCS"}`;
  const appClasses = ["app", qaMode ? "is-qa" : "", ready ? "is-ready" : "is-booting", detailIndex != null ? "has-detail" : "", transitioning ? "is-transitioning" : "", archiveOpen ? "has-overlay" : ""].filter(Boolean).join(" ");
  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse") pointerStartRef.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event) => {
    if (!pointerStartRef.current || detailIndex != null || archiveOpen) return;
    const deltaY = event.clientY - pointerStartRef.current.y;
    const deltaX = event.clientX - pointerStartRef.current.x;
    pointerStartRef.current = null;
    const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    if (Math.abs(delta) >= 42) targetRef.current = clamp(Math.round(targetRef.current) + (delta < 0 ? 1 : -1), 0, activeDocuments.length - 1);
  };
  const handleSearch = (query) => {
    const normalized = query.toLocaleLowerCase();
    const index = activeDocuments.findIndex((era) => [era.date, era.title, era.category, era.description, ...era.keywords].join(" ").toLocaleLowerCase().includes(normalized));
    if (index < 0) setSearchStatus(`NO DOCUMENT MATCHED “${query.toUpperCase()}”`);
    else jumpTo(index);
  };

  return (
    <main className={appClasses} style={{ "--accent": accent, "--timeline-progress": `${progressPercent}%` }} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <NeuralField progressRef={progressRef} detailIndex={detailIndex} accent={accent} />
      <div className="screen-texture" aria-hidden="true" /><div className="scanlines" aria-hidden="true" />
      <div className="base-ui" inert={!ready || archiveOpen}>
        <header className="top-nav">
          <button type="button" className="brand" onClick={() => activateSection(section, 0)} aria-label="回到当前分类第一个文档"><span className="brand__mark">C/W/A</span><span className="brand__copy">PROJECT<br />MEMORY</span></button>
          <div className="top-nav__status"><span><i /> ARCHIVE ONLINE</span><span>{sectionStatus}</span></div>
          <nav className="home-section-tabs" aria-label="首页文档分类" role="tablist">
            {HOME_SECTIONS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={section === item.id} className={section === item.id ? "is-active" : ""} onClick={() => activateSection(item.id)}>{item.label}</button>)}
            <button type="button" className="archive-toggle" title="打开全部文档索引" aria-label="打开全部文档索引" onClick={() => setArchiveOpen(true)}><ListFilter size={13} /></button>
          </nav>
        </header>
        <aside className="timeline-rail" aria-label="文档进度"><div className="timeline-rail__top">{activeEra.year}</div><div className="timeline-rail__track"><span /></div><div className="timeline-rail__bottom">{pad(activeIndex)} / {String(activeDocuments.length).padStart(2, "0")}</div></aside>
        <section className="timeline-scene" aria-label={`create-wl-app ${HOME_SECTIONS.find((item) => item.id === section)?.label}`}>
          <div className="timeline-scene__axis" aria-hidden="true" />
          {activeDocuments.map((era, index) => Math.abs(index - visualProgress) <= 4.2 ? <EraCard key={era.id} era={era} index={index} progress={visualProgress} onSelect={(selectedIndex, isActive) => isActive ? openDetail(selectedIndex, true) : jumpTo(selectedIndex)} viewport={viewport} total={activeDocuments.length} /> : null)}
        </section>
        <div className="active-caption" key={activeEra.id}><p><ScrambleText text={`${pad(activeIndex)} / ${activeEra.category}`} duration={420} /></p><h1><ScrambleText text={activeEra.titleEn} delay={70} duration={620} /></h1><span>{activeEra.kicker}</span></div>
        <SearchConsole key={section} onSearch={handleSearch} status={searchStatus} placeholder={`搜索${HOME_SECTIONS.find((item) => item.id === section)?.label}...`} />
      </div>
      {detailEra && <DetailView era={detailEra} index={detailIndex} onClose={closeDetail} onPrevious={() => shiftDetail(-1)} onNext={() => shiftDetail(1)} onRead={() => navigateToDocument(detailEra)} total={activeDocuments.length} inactive={archiveOpen} />}
      {archiveOpen && <ArchiveOverlay activeDocumentId={activeEra.id} onClose={() => setArchiveOpen(false)} onSelectDocument={focusDocument} />}
      <div className="warp-transition" aria-hidden="true"><span /><span /><span /></div>
      <Cursor />
      {!ready && !qaMode && <Intro onComplete={() => setReady(true)} />}
    </main>
  );
}
