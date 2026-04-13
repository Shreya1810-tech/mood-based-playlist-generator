import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '../context/MoodContext';
import './LoadingTransition.css';

export default function LoadingTransition({ onComplete }) {
  const { currentMood } = useMood();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    'Sensing your emotions...',
    currentMood.loadingText || 'Curating your soundtrack...',
    'Almost there...',
  ];

  useEffect(() => {
    const duration = 2800;
    const interval = 30;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);

      if (p > 33 && phase === 0) setPhase(1);
      if (p > 72 && phase <= 1) setPhase(2);
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => onComplete(), 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, phase, currentMood]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Pulsing mood orb */}
      <motion.div
        className="loading-orb"
        style={{
          background: `radial-gradient(circle, ${currentMood.primary}, ${currentMood.secondary})`,
          boxShadow: `0 0 60px ${currentMood.glow}, 0 0 120px ${currentMood.glow}`,
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: currentMood.energy > 0.6 ? 1 : 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Phase text */}
      <motion.p
        className="loading-text"
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {phases[phase]}
      </motion.p>

      {/* Progress bar */}
      <div className="loading-bar-track">
        <motion.div
          className="loading-bar-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${currentMood.primary}, ${currentMood.accent})`,
          }}
        />
      </div>

      {/* Emoji */}
      <motion.span
        className="loading-emoji"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {currentMood.emoji}
      </motion.span>
    </motion.div>
  );
}
