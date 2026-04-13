import { useEffect, useRef } from 'react';
import { useMood } from '../context/MoodContext';
import './AudioVisualizer.css';

export default function AudioVisualizer({ isPlaying, barCount = 32 }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const barsRef = useRef(Array.from({ length: barCount }, () => Math.random() * 0.3 + 0.05));
  const { currentMood } = useMood();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const animate = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const barW = (W - (barCount - 1) * 2) / barCount;
      const speed = isPlaying ? (currentMood.energy > 0.6 ? 0.18 : 0.08) : 0.02;

      barsRef.current = barsRef.current.map((h, i) => {
        const target = isPlaying
          ? Math.random() * 0.7 + 0.1
          : Math.sin(Date.now() / 2000 + i * 0.5) * 0.1 + 0.12;
        return h + (target - h) * speed;
      });

      /* Parse hex -> rgb for gradient */
      const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
      };

      const primaryRgb = hexToRgb(currentMood.primary.startsWith('#') ? currentMood.primary : '#6366f1');
      const accentRgb  = hexToRgb(currentMood.accent.startsWith('#')  ? currentMood.accent  : '#a78bfa');

      barsRef.current.forEach((h, i) => {
        const x = i * (barW + 2);
        const barH = h * H;
        const y = H - barH;

        const grad = ctx.createLinearGradient(x, y, x, H);
        grad.addColorStop(0, `rgba(${accentRgb}, 0.9)`);
        grad.addColorStop(1, `rgba(${primaryRgb}, 0.3)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, [barW / 2, barW / 2, 2, 2]);
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
    };
  }, [isPlaying, barCount, currentMood]);

  return (
    <div className="visualizer-wrap" aria-hidden="true" title="Audio visualizer">
      <canvas ref={canvasRef} className="visualizer-canvas" />
    </div>
  );
}
