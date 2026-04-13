import { useEffect, useRef } from 'react';
import { useMood } from '../context/MoodContext';
import './AmbientBackground.css';

export default function AmbientBackground() {
  const { currentMood } = useMood();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const blobs = containerRef.current.querySelectorAll('.ambient-blob');
    const speed = currentMood.energy > 0.6 ? '8s' : '16s';
    blobs.forEach(blob => {
      blob.style.animationDuration = speed;
    });
  }, [currentMood]);

  return (
    <div className="ambient-background" ref={containerRef} aria-hidden="true">
      <div className="ambient-gradient" />
      <div
        className="ambient-blob blob-1"
        style={{ background: `radial-gradient(circle, ${currentMood.primary}44, transparent 70%)` }}
      />
      <div
        className="ambient-blob blob-2"
        style={{ background: `radial-gradient(circle, ${currentMood.secondary}33, transparent 70%)` }}
      />
      <div
        className="ambient-blob blob-3"
        style={{ background: `radial-gradient(circle, ${currentMood.accent}22, transparent 70%)` }}
      />
      <div className="ambient-noise" />
    </div>
  );
}
