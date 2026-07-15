import { useEffect, useRef } from "react";

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function seeded(seed) {
  let value = seed * 9301 + 49297;
  return () => {
    value = (value * 233280 + 49297) % 233280;
    return value / 233280;
  };
}

export function EraVisual({ mode, accent, seed = 1, active = false, detail = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const qaMode = new URLSearchParams(window.location.search).has("qa");
    const ctx = canvas.getContext("2d");
    const rgb = hexToRgb(accent);
    let raf = 0;
    let stopped = false;
    let size = { width: 0, height: 0, dpr: 1 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, detail ? 1.5 : 1.25);
      size = { width: Math.max(1, rect.width), height: Math.max(1, rect.height), dpr };
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const line = (x1, y1, x2, y2, alpha = 0.35, width = 1) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    const dot = (x, y, radius, alpha = 0.8) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      ctx.fill();
    };

    const drawGrid = (w, h, alpha = 0.08) => {
      const step = detail ? 34 : 24;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      for (let x = -h; x < w + h; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - h * 0.35, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) line(0, y, w, y, alpha * 0.65);
    };

    const draw = (timestamp = 0) => {
      if (stopped) return;
      const { width: w, height: h } = size;
      const t = timestamp * 0.001;
      const rand = seeded(seed * 101 + 7);
      ctx.clearRect(0, 0, w, h);

      const background = ctx.createRadialGradient(w * 0.5, h * 0.48, 0, w * 0.5, h * 0.48, Math.max(w, h) * 0.75);
      background.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${detail ? 0.24 : active ? 0.13 : 0.08})`);
      background.addColorStop(0.52, detail ? "rgba(21, 29, 34, 0.68)" : "rgba(8, 10, 14, 0.46)");
      background.addColorStop(1, detail ? "rgba(2, 4, 6, 0.96)" : "rgba(0, 0, 0, 0.94)");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      drawGrid(w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      if (mode === "neuron") {
        const nodes = Array.from({ length: detail ? 42 : 22 }, (_, i) => ({
          x: w * (0.12 + rand() * 0.76),
          y: h * (0.12 + rand() * 0.76),
          r: 1.1 + rand() * (detail ? 3.4 : 2.1),
          p: rand() * Math.PI * 2,
          i,
        }));
        nodes.forEach((node, i) => {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const other = nodes[j];
            const dist = Math.hypot(node.x - other.x, node.y - other.y);
            if (dist < w * 0.19 && rand() > 0.45) line(node.x, node.y, other.x, other.y, 0.08 + 0.12 * Math.sin(t + node.p));
          }
          dot(node.x, node.y, node.r + Math.sin(t * 1.4 + node.p) * 0.65, 0.5 + 0.45 * Math.sin(t + node.p));
        });
      } else if (mode === "test") {
        const cx = w * 0.52;
        const cy = h * 0.49;
        for (let i = 0; i < 7; i += 1) {
          ctx.beginPath();
          ctx.arc(cx, cy, (i + 1) * Math.min(w, h) * 0.075 + Math.sin(t * 0.8 + i) * 3, -0.3 + i * 0.18, Math.PI * 1.2 + i * 0.1);
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.08 + i * 0.035})`;
          ctx.lineWidth = i === 5 ? 2 : 1;
          ctx.stroke();
        }
        line(cx - w * 0.33, cy, cx + w * 0.33, cy, 0.35);
        line(cx, cy - h * 0.37, cx, cy + h * 0.37, 0.18);
        const scan = ((t * 0.16) % 1) * w;
        line(scan, h * 0.12, scan, h * 0.88, 0.65, 1.5);
      } else if (mode === "conference") {
        const cols = detail ? 18 : 12;
        const rows = detail ? 9 : 7;
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const px = w * 0.12 + (x / (cols - 1)) * w * 0.76;
            const py = h * 0.16 + (y / (rows - 1)) * h * 0.68;
            const wave = Math.sin(t * 1.2 + x * 0.45 + y * 0.7);
            dot(px, py, 1.2 + (wave + 1) * 0.8, 0.18 + (wave + 1) * 0.2);
          }
        }
        ctx.font = `${Math.max(20, w * 0.085)}px "IBM Plex Mono"`;
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.16)`;
        ctx.textAlign = "center";
        ctx.fillText("AI", w * 0.5, h * 0.59);
      } else if (mode === "perceptron" || mode === "backprop") {
        const layers = mode === "perceptron" ? [5, 1] : [5, 7, 5, 3];
        const coords = layers.map((count, li) => Array.from({ length: count }, (_, i) => ({
          x: w * (0.14 + (li / Math.max(1, layers.length - 1)) * 0.72),
          y: h * (0.18 + (i / Math.max(1, count - 1)) * 0.64),
          phase: rand() * Math.PI * 2,
        })));
        for (let li = 0; li < coords.length - 1; li += 1) {
          coords[li].forEach((a) => coords[li + 1].forEach((b) => {
            const pulse = 0.08 + 0.12 * (1 + Math.sin(t * 2 - li * 0.8 + a.phase));
            line(a.x, a.y, b.x, b.y, pulse);
          }));
        }
        coords.flat().forEach((n) => dot(n.x, n.y, 2.1 + Math.sin(t * 1.3 + n.phase), 0.45));
        if (mode === "backprop") {
          const sweep = 1 - ((t * 0.22) % 1);
          line(w * (0.14 + sweep * 0.72), h * 0.08, w * (0.14 + sweep * 0.72), h * 0.92, 0.55, 2);
        }
      } else if (mode === "dialog" || mode === "chat") {
        const lines = detail ? 12 : 7;
        for (let i = 0; i < lines; i += 1) {
          const y = h * 0.18 + i * (h * 0.64) / Math.max(1, lines - 1);
          const side = i % 2;
          const width = w * (0.18 + rand() * 0.34);
          const x = side ? w * 0.56 : w * 0.12;
          ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.08 + 0.1 * ((i + t) % 2)})`;
          ctx.fillRect(x, y, width, detail ? 7 : 4);
          if (i === Math.floor((t * 0.8) % lines)) dot(x - 9, y + 2, 2.3, 0.85);
        }
        const cursor = (Math.sin(t * 5) > 0 ? 1 : 0) * 0.8;
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${cursor})`;
        ctx.fillRect(w * 0.12, h * 0.86, detail ? 14 : 9, 2);
      } else if (mode === "chess") {
        const board = Math.min(w * 0.62, h * 0.74);
        const sx = w * 0.5 - board * 0.5;
        const sy = h * 0.5 - board * 0.5;
        const cell = board / 8;
        ctx.save();
        ctx.transform(1, -0.16, 0.28, 0.72, -w * 0.08, h * 0.18);
        for (let y = 0; y < 8; y += 1) {
          for (let x = 0; x < 8; x += 1) {
            ctx.fillStyle = (x + y) % 2 ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.18)` : "rgba(255,255,255,0.025)";
            ctx.fillRect(sx + x * cell, sy + y * cell, cell - 1, cell - 1);
          }
        }
        ctx.restore();
        for (let i = 0; i < 8; i += 1) {
          const x = w * (0.2 + rand() * 0.6);
          const y = h * (0.2 + rand() * 0.6);
          dot(x, y, 2 + rand() * 3, 0.3 + 0.4 * Math.sin(t + i));
        }
      } else if (mode === "vision") {
        const cols = detail ? 16 : 11;
        const rows = detail ? 10 : 7;
        const cellW = w * 0.72 / cols;
        const cellH = h * 0.62 / rows;
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const value = (Math.sin(x * 1.7 + y * 0.7 + t) + Math.cos(y * 1.4 - t * 0.6) + 2) / 4;
            ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.025 + value * 0.28})`;
            ctx.fillRect(w * 0.14 + x * cellW, h * 0.19 + y * cellH, cellW - 1, cellH - 1);
          }
        }
        const bx = w * (0.2 + 0.42 * (0.5 + 0.5 * Math.sin(t * 0.55)));
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.65)`;
        ctx.strokeRect(bx, h * 0.28, w * 0.25, h * 0.42);
      } else if (mode === "go") {
        const board = Math.min(w * 0.7, h * 0.75);
        const x0 = w * 0.5 - board * 0.5;
        const y0 = h * 0.5 - board * 0.5;
        for (let i = 0; i < 9; i += 1) {
          line(x0 + (i / 8) * board, y0, x0 + (i / 8) * board, y0 + board, 0.1);
          line(x0, y0 + (i / 8) * board, x0 + board, y0 + (i / 8) * board, 0.1);
        }
        for (let i = 0; i < (detail ? 28 : 16); i += 1) {
          const gx = Math.floor(rand() * 9);
          const gy = Math.floor(rand() * 9);
          const pulse = 0.35 + 0.55 * Math.sin(t * 1.2 + i);
          dot(x0 + (gx / 8) * board, y0 + (gy / 8) * board, detail ? 4.2 : 2.8, Math.max(0.08, pulse));
        }
      } else if (mode === "attention") {
        const tokens = Array.from({ length: detail ? 18 : 12 }, (_, i) => ({
          x: w * (0.1 + (i / (detail ? 17 : 11)) * 0.8),
          y: h * (0.35 + 0.16 * Math.sin(i * 1.3)),
          p: rand() * Math.PI * 2,
        }));
        tokens.forEach((a, i) => {
          tokens.forEach((b, j) => {
            if (i !== j && (i + j) % 5 === 0) {
              const focus = 0.06 + 0.14 * (1 + Math.sin(t + a.p + j));
              line(a.x, a.y, b.x, b.y, focus);
            }
          });
          dot(a.x, a.y, 2.2 + 1.1 * Math.sin(t * 1.4 + a.p), 0.45);
        });
        line(w * 0.1, h * 0.66, w * 0.9, h * 0.66, 0.24);
      } else if (mode === "scaling") {
        const bars = detail ? 38 : 25;
        for (let i = 0; i < bars; i += 1) {
          const p = i / (bars - 1);
          const y = h * (0.83 - Math.pow(p, 1.65) * 0.62);
          const x = w * (0.1 + p * 0.8);
          line(x, h * 0.84, x, y + Math.sin(t + i) * 3, 0.12 + p * 0.45, detail ? 3 : 2);
        }
        ctx.beginPath();
        for (let i = 0; i < bars; i += 1) {
          const p = i / (bars - 1);
          const x = w * (0.1 + p * 0.8);
          const y = h * (0.83 - Math.pow(p, 1.65) * 0.62);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.65)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      } else {
        const orbitCount = detail ? 9 : 6;
        const cx = w * 0.5;
        const cy = h * 0.5;
        for (let i = 0; i < orbitCount; i += 1) {
          const a = t * (0.25 + i * 0.025) + i * Math.PI * 2 / orbitCount;
          const rx = w * (0.16 + i * 0.018);
          const ry = h * (0.18 + i * 0.015);
          const x = cx + Math.cos(a) * rx;
          const y = cy + Math.sin(a * 1.3) * ry;
          line(cx, cy, x, y, 0.1 + i * 0.02);
          dot(x, y, detail ? 5 : 3, 0.38 + 0.4 * Math.sin(t + i));
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, i * 0.18, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.055)`;
          ctx.stroke();
        }
        dot(cx, cy, detail ? 8 : 5, 0.85);
      }

      ctx.restore();

      const scanY = ((t * (active || detail ? 0.12 : 0.02) + seed * 0.07) % 1) * h;
      const scanGradient = ctx.createLinearGradient(0, scanY - 24, 0, scanY + 24);
      scanGradient.addColorStop(0, "rgba(255,255,255,0)");
      scanGradient.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},${active || detail ? 0.09 : 0.035})`);
      scanGradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 24, w, 48);

      if ((active || detail) && !qaMode) raf = requestAnimationFrame(draw);
    };

    resize();
    draw(qaMode ? 5000 : performance.now());
    const observer = new ResizeObserver(() => {
      resize();
      if (qaMode || (!active && !detail)) draw(qaMode ? 5000 : performance.now());
    });
    observer.observe(canvas);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [mode, accent, seed, active, detail]);

  return <canvas ref={ref} className="era-visual" aria-hidden="true" />;
}
