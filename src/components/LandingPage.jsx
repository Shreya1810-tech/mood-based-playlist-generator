import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Clock, ChevronRight, Zap } from 'lucide-react';
import { useMood, MOOD_PRESETS } from '../context/MoodContext';
import { detectMoodFromText, getTimeOfDayGreeting } from '../data/mockData';
import './LandingPage.css';

const EMOJIS = Object.values(MOOD_PRESETS);

export default function LandingPage({ onGenerate }) {
  const { selectMood, energyLevel, setEnergyLevel, currentMood } = useMood();
  const [inputMode, setInputMode] = useState('emoji'); // 'emoji' | 'text' | 'wheel'
  const [textInput, setTextInput] = useState('');
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [hoveredMood, setHoveredMood] = useState(null);
  const textRef = useRef(null);
  const timeInfo = getTimeOfDayGreeting();

  const handleEmojiSelect = (moodId) => {
    setSelectedMoodId(moodId);
    selectMood(moodId);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const detectedMood = detectMoodFromText(textInput);
    setSelectedMoodId(detectedMood);
    selectMood(detectedMood);
    setTimeout(() => onGenerate(), 300);
  };

  const handleGenerate = () => {
    if (selectedMoodId) {
      onGenerate();
    }
  };

  const handleSurprise = () => {
    const moods = Object.keys(MOOD_PRESETS);
    const random = moods[Math.floor(Math.random() * moods.length)];
    setSelectedMoodId(random);
    selectMood(random);
    setTimeout(() => onGenerate(true), 300);
  };

  /* Focus text input when switching to text mode */
  useEffect(() => {
    if (inputMode === 'text' && textRef.current) {
      textRef.current.focus();
    }
  }, [inputMode]);

  return (
    <motion.div
      className="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── Header ── */}
      <header className="landing-header">
        <motion.div
          className="logo-mark"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="logo-icon">🎵</span>
          <span className="logo-text">MoodWave</span>
        </motion.div>
      </header>

      {/* ── Hero ── */}
      <motion.section
        className="landing-hero"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="time-greeting">
          <span className="time-emoji">{timeInfo.emoji}</span>
          <span className="time-text">{timeInfo.greeting}</span>
        </div>
        <h1 id="main-heading">How are you feeling<br /><span className="hero-highlight">right now?</span></h1>
        <p className="hero-subtitle">Select your mood and we'll create a playlist that truly resonates.</p>
      </motion.section>

      {/* ── Input Mode Tabs ── */}
      <motion.div
        className="input-tabs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          id="tab-emoji"
          className={`input-tab ${inputMode === 'emoji' ? 'active' : ''}`}
          onClick={() => setInputMode('emoji')}
          aria-label="Select mood by emoji"
        >
          <span>😊</span> Emoji
        </button>
        <button
          id="tab-text"
          className={`input-tab ${inputMode === 'text' ? 'active' : ''}`}
          onClick={() => setInputMode('text')}
          aria-label="Describe your mood"
        >
          <Search size={16} /> Text
        </button>
        <button
          id="tab-wheel"
          className={`input-tab ${inputMode === 'wheel' ? 'active' : ''}`}
          onClick={() => setInputMode('wheel')}
          aria-label="Mood wheel selector"
        >
          <span>🎡</span> Wheel
        </button>
      </motion.div>

      {/* ── Input Areas ── */}
      <AnimatePresence mode="wait">
        {inputMode === 'emoji' && (
          <motion.div
            key="emoji"
            className="mood-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {EMOJIS.map((mood) => (
              <motion.button
                key={mood.id}
                id={`mood-${mood.id}`}
                className={`mood-card ${selectedMoodId === mood.id ? 'selected' : ''}`}
                onClick={() => handleEmojiSelect(mood.id)}
                onMouseEnter={() => setHoveredMood(mood.id)}
                onMouseLeave={() => setHoveredMood(null)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  '--card-color': mood.primary,
                  '--card-glow': mood.glow,
                }}
                aria-label={`Select ${mood.label} mood`}
                role="radio"
                aria-checked={selectedMoodId === mood.id}
              >
                <span className="mood-card-emoji">{mood.emoji}</span>
                <span className="mood-card-label">{mood.label}</span>
                {selectedMoodId === mood.id && (
                  <motion.div
                    className="mood-card-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {inputMode === 'text' && (
          <motion.form
            key="text"
            className="text-input-area"
            onSubmit={handleTextSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-input-wrapper glass">
              <Search size={20} className="text-input-icon" />
              <input
                ref={textRef}
                id="mood-text-input"
                type="text"
                className="text-input"
                placeholder='Try "I feel tired but hopeful" or "ready to dance"'
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                aria-label="Describe how you're feeling"
                autoComplete="off"
              />
              <button
                type="submit"
                className="text-submit-btn"
                disabled={!textInput.trim()}
                aria-label="Analyze mood"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <p className="text-hint">
              We'll interpret your feelings and find the perfect soundtrack.
            </p>
          </motion.form>
        )}

        {inputMode === 'wheel' && (
          <motion.div
            key="wheel"
            className="mood-wheel-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mood-wheel" role="radiogroup" aria-label="Mood wheel selector">
              {EMOJIS.map((mood, i) => {
                const angle = (i / EMOJIS.length) * 360 - 90;
                const radius = 130;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                return (
                  <motion.button
                    key={mood.id}
                    id={`wheel-${mood.id}`}
                    className={`wheel-node ${selectedMoodId === mood.id ? 'selected' : ''}`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      '--node-color': mood.primary,
                    }}
                    onClick={() => handleEmojiSelect(mood.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Select ${mood.label}`}
                    role="radio"
                    aria-checked={selectedMoodId === mood.id}
                  >
                    <span className="wheel-emoji">{mood.emoji}</span>
                    <span className="wheel-label">{mood.label}</span>
                  </motion.button>
                );
              })}
              <div className="wheel-center">
                <span className="wheel-center-emoji">
                  {selectedMoodId ? MOOD_PRESETS[selectedMoodId]?.emoji : '?'}
                </span>
                <span className="wheel-center-label">
                  {selectedMoodId ? MOOD_PRESETS[selectedMoodId]?.label : 'Pick one'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Energy Slider ── */}
      <motion.div
        className="energy-section"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="energy-header">
          <Zap size={16} className="energy-icon" />
          <label htmlFor="energy-slider" className="energy-label">Energy Level</label>
          <span className="energy-value">{Math.round(energyLevel * 100)}%</span>
        </div>
        <div className="energy-slider-track">
          <input
            id="energy-slider"
            type="range"
            min="0"
            max="100"
            value={Math.round(energyLevel * 100)}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value) / 100)}
            className="energy-slider"
            aria-label="Energy level from low to high"
          />
          <div
            className="energy-fill"
            style={{ width: `${energyLevel * 100}%` }}
          />
        </div>
        <div className="energy-labels">
          <span>🧘 Low</span>
          <span>⚡ High</span>
        </div>
      </motion.div>

      {/* ── Action Buttons ── */}
      <motion.div
        className="action-buttons"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <motion.button
          id="generate-btn"
          className="btn-primary"
          onClick={handleGenerate}
          disabled={!selectedMoodId}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Generate playlist"
        >
          <Sparkles size={18} />
          Generate My Playlist
        </motion.button>
        <motion.button
          id="surprise-btn"
          className="btn-ghost"
          onClick={handleSurprise}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Generate a surprise random playlist"
        >
          🎲 Surprise Me
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
