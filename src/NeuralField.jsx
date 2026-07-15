import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return t * t * (3 - 2 * t);
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function randomFactory(seed = 9341) {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

export function NeuralField({ progressRef, detailIndex, accent }) {
  const canvasRef = useRef(null);
  const accentRef = useRef(accent);
  const detailRef = useRef(detailIndex);

  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);

  useEffect(() => {
    detailRef.current = detailIndex;
  }, [detailIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: false });
    const qaMode = new URLSearchParams(window.location.search).has("qa");
    const rand = randomFactory(12.7);
    const pointCount = qaMode ? (window.innerWidth < 700 ? 460 : 650) : (window.innerWidth < 700 ? 720 : 1250);
    const points = Array.from({ length: pointCount }, (_, index) => {
      const u = rand();
      const gridIndex = index;
      const gridCols = Math.ceil(Math.sqrt(pointCount * 1.7));
      const gridRows = Math.ceil(pointCount / gridCols);
      return {
        u,
        y: (u - 0.5) * 6.4,
        angle: rand() * Math.PI * 2,
        radius: 0.25 + rand() * 0.82,
        petal: Math.floor(rand() * 7),
        phase: rand() * Math.PI * 2,
        drift: rand() * 2 - 1,
        gx: (gridIndex % gridCols) / Math.max(1, gridCols - 1) - 0.5,
        gy: Math.floor(gridIndex / gridCols) / Math.max(1, gridRows - 1) - 0.5,
      };
    });
    const stars = Array.from({ length: window.innerWidth < 700 ? 90 : 180 }, () => ({
      x: rand(),
      y: rand(),
      s: 0.25 + rand() * 1.15,
      a: 0.03 + rand() * 0.16,
      p: rand() * Math.PI * 2,
    }));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let time = qaMode ? 5 : 0;
    let detailMix = detailRef.current == null ? 0 : 1;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event) => {
      mouse.tx = (event.clientX / Math.max(1, width) - 0.5) * 2;
      mouse.ty = (event.clientY / Math.max(1, height) - 0.5) * 2;
    };

    const drawNoise = () => {
      ctx.save();
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < 90; i += 1) {
        const x = (i * 131 + Math.floor(time * 17)) % Math.max(1, width);
        const y = (i * 71 + Math.floor(time * 11)) % Math.max(1, height);
        ctx.fillStyle = i % 3 === 0 ? "rgba(255,255,255,.05)" : "rgba(110,180,190,.022)";
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.restore();
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reducedMotion) time += dt;
      const targetDetail = detailRef.current == null ? 0 : 1;
      detailMix = lerp(detailMix, targetDetail, 1 - Math.pow(0.002, dt));
      mouse.x = lerp(mouse.x, mouse.tx, 1 - Math.pow(0.02, dt));
      mouse.y = lerp(mouse.y, mouse.ty, 1 - Math.pow(0.02, dt));

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#020304";
      ctx.fillRect(0, 0, width, height);

      const accentRgb = hexToRgb(accentRef.current);
      const background = ctx.createRadialGradient(
        width * (0.5 + mouse.x * 0.02),
        height * (0.48 + mouse.y * 0.02),
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.76,
      );
      background.addColorStop(0, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.07 + detailMix * 0.08})`);
      background.addColorStop(0.34, "rgba(12,16,20,.34)");
      background.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      stars.forEach((star) => {
        const alpha = star.a * (0.55 + 0.45 * Math.sin(time * 0.35 + star.p));
        ctx.fillStyle = `rgba(190,220,225,${alpha})`;
        ctx.fillRect(star.x * width + mouse.x * star.s * 2, star.y * height + mouse.y * star.s * 2, star.s, star.s);
      });
      ctx.restore();

      const progress = progressRef.current || 0;
      const rotation = progress * 0.73 + time * 0.035;
      const cameraTilt = mouse.y * 0.11;
      const cameraPan = mouse.x * 0.16;
      const morph = easeInOut(clamp(detailMix, 0, 1));
      const focal = Math.min(width, height) * (width < 700 ? 1.28 : 1.05);
      const centerX = width * 0.5;
      const centerY = height * (width < 700 ? 0.42 : 0.49);
      const projected = [];

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const spineWave = Math.sin(p.y * 1.35 + time * 0.22 + p.petal * 0.9);
        const petals = 0.55 + 0.4 * Math.sin(p.y * 2.1 + p.petal * 0.9 + time * 0.16);
        const flowerRadius = (0.9 + 0.72 * petals) * p.radius * (1 - Math.pow(Math.abs(p.y) / 4.4, 1.65) * 0.45);
        const theta = p.angle + p.y * 0.84 + p.petal * 0.42 + rotation;
        let x = Math.cos(theta) * flowerRadius + Math.sin(p.y * 0.7 + time * 0.3) * 0.22;
        let y = p.y * 0.78;
        let z = Math.sin(theta) * flowerRadius + spineWave * 0.18;

        const gridWave = Math.sin(p.gx * 9 + time * 0.8 + p.phase) * Math.cos(p.gy * 8 - time * 0.42);
        let dx = p.gx * (width < 700 ? 3.2 : 5.4);
        let dy = -p.gy * (width < 700 ? 4.2 : 3.15);
        let dz = gridWave * 0.42 + p.drift * 0.2;

        const detailTurn = -0.14 + mouse.x * 0.08;
        const cosD = Math.cos(detailTurn);
        const sinD = Math.sin(detailTurn);
        const rdx = dx * cosD - dz * sinD;
        const rdz = dx * sinD + dz * cosD;
        dx = rdx;
        dz = rdz;

        x = lerp(x, dx, morph);
        y = lerp(y, dy, morph);
        z = lerp(z, dz, morph);

        const cosX = Math.cos(cameraTilt);
        const sinX = Math.sin(cameraTilt);
        const yy = y * cosX - z * sinX;
        const zz = y * sinX + z * cosX;
        y = yy;
        z = zz;

        const cosY = Math.cos(cameraPan * (1 - morph));
        const sinY = Math.sin(cameraPan * (1 - morph));
        const xx = x * cosY - z * sinY;
        const z2 = x * sinY + z * cosY;
        x = xx;
        z = z2;

        const depth = z + (morph ? 7.4 : 6.1);
        const scale = focal / Math.max(1.2, depth);
        const sx = centerX + x * scale;
        const sy = centerY - y * scale;
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;
        projected.push({
          sx,
          sy,
          z,
          scale,
          alpha: clamp(0.13 + (z + 2.5) * 0.115 + p.radius * 0.28, 0.09, 0.9),
          phase: p.phase,
          gridWave,
          index: i,
        });
      }

      projected.sort((a, b) => a.z - b.z);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const lineStride = width < 700 ? 34 : 27;
      for (let i = lineStride; i < projected.length; i += lineStride) {
        const a = projected[i - lineStride];
        const b = projected[i];
        const distance = Math.hypot(a.sx - b.sx, a.sy - b.sy);
        if (distance < Math.min(width, height) * (morph ? 0.19 : 0.12)) {
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.018 + morph * 0.025})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }

      projected.forEach((p, order) => {
        const front = clamp((p.z + 2.2) / 4.4, 0, 1);
        const sparkle = 0.62 + 0.38 * Math.sin(time * 1.15 + p.phase + order * 0.006);
        const alpha = p.alpha * sparkle * 0.9;
        const radius = clamp((morph ? 0.018 : 0.014) * p.scale * (0.82 + front * 0.5), 0.55, morph ? 3.7 : 3.1);
        const white = Math.round(210 + front * 45);
        const mix = morph ? 0.5 + 0.35 * p.gridWave : 0.18 + front * 0.2;
        const r = Math.round(lerp(white, accentRgb.r, mix));
        const g = Math.round(lerp(white, accentRgb.g, mix));
        const b = Math.round(lerp(white, accentRgb.b, mix));

        if (order % 19 === 0 && front > 0.45) {
          ctx.fillStyle = `rgba(255,45,95,${alpha * 0.08})`;
          ctx.beginPath();
          ctx.arc(p.sx - 2.2, p.sy, radius * 1.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(20,220,255,${alpha * 0.09})`;
          ctx.beginPath();
          ctx.arc(p.sx + 2.2, p.sy, radius * 1.15, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.08 + mouse.x * 0.025);
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.min(width, height) * (0.18 + i * 0.066), Math.min(width, height) * (0.055 + i * 0.024), i * 0.24 + time * 0.008, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${(0.038 + i * 0.008) * (1 - morph * 0.6)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.restore();

      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, Math.min(width, height) * 0.16, width * 0.5, height * 0.5, Math.max(width, height) * 0.72);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.68, "rgba(0,0,0,.18)");
      vignette.addColorStop(1, "rgba(0,0,0,.88)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
      drawNoise();

      if (!qaMode) raf = requestAnimationFrame(frame);
    };

    const handleResize = () => {
      resize();
      if (qaMode) frame(performance.now());
    };
    resize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="neural-field" aria-hidden="true" />;
}
