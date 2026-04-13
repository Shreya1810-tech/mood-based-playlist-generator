import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MoodContext = createContext(null);

/* ── Mood Presets ── */
export const MOOD_PRESETS = {
  happy: {
    id: 'happy',
    label: 'Happy',
    emoji: '😊',
    valence: 0.85,
    energy: 0.8,
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.35)',
    bg1: '#0f0a05',
    bg2: '#1a1208',
    bg3: '#2a1f0d',
    loadingText: 'Finding your sunshine vibes...',
    genre: 'pop',
  },
  energetic: {
    id: 'energetic',
    label: 'Energetic',
    emoji: '⚡',
    valence: 0.9,
    energy: 0.95,
    primary: '#ef4444',
    secondary: '#f97316',
    accent: '#fb923c',
    glow: 'rgba(239, 68, 68, 0.35)',
    bg1: '#0f0505',
    bg2: '#1a0a08',
    bg3: '#2a120d',
    loadingText: 'Cranking up the energy...',
    genre: 'electronic',
  },
  calm: {
    id: 'calm',
    label: 'Calm',
    emoji: '🌊',
    valence: 0.6,
    energy: 0.25,
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#93c5fd',
    glow: 'rgba(59, 130, 246, 0.35)',
    bg1: '#050a0f',
    bg2: '#081220',
    bg3: '#0d1a30',
    loadingText: 'Curating your peaceful escape...',
    genre: 'ambient',
  },
  sad: {
    id: 'sad',
    label: 'Sad',
    emoji: '🌧️',
    valence: 0.2,
    energy: 0.2,
    primary: '#8b5cf6',
    secondary: '#6d28d9',
    accent: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.35)',
    bg1: '#08050f',
    bg2: '#0f0a1a',
    bg3: '#1a122a',
    loadingText: 'Finding songs that understand...',
    genre: 'indie',
  },
  romantic: {
    id: 'romantic',
    label: 'Romantic',
    emoji: '💕',
    valence: 0.75,
    energy: 0.45,
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f9a8d4',
    glow: 'rgba(236, 72, 153, 0.35)',
    bg1: '#0f050a',
    bg2: '#1a0812',
    bg3: '#2a0d1a',
    loadingText: 'Setting the mood for romance...',
    genre: 'r&b',
  },
  focused: {
    id: 'focused',
    label: 'Focused',
    emoji: '🎯',
    valence: 0.55,
    energy: 0.6,
    primary: '#10b981',
    secondary: '#059669',
    accent: '#6ee7b7',
    glow: 'rgba(16, 185, 129, 0.35)',
    bg1: '#050f0a',
    bg2: '#081a12',
    bg3: '#0d2a1a',
    loadingText: 'Building your focus zone...',
    genre: 'lo-fi',
  },
  nostalgic: {
    id: 'nostalgic',
    label: 'Nostalgic',
    emoji: '✨',
    valence: 0.5,
    energy: 0.4,
    primary: '#d97706',
    secondary: '#b45309',
    accent: '#fcd34d',
    glow: 'rgba(217, 119, 6, 0.35)',
    bg1: '#0f0a05',
    bg2: '#1a1408',
    bg3: '#2a200d',
    loadingText: 'Traveling back in time...',
    genre: 'classic',
  },
  angry: {
    id: 'angry',
    label: 'Angry',
    emoji: '🔥',
    valence: 0.3,
    energy: 0.9,
    primary: '#dc2626',
    secondary: '#991b1b',
    accent: '#fca5a5',
    glow: 'rgba(220, 38, 38, 0.4)',
    bg1: '#0f0305',
    bg2: '#1a0508',
    bg3: '#2a0a0d',
    loadingText: 'Channeling that fire...',
    genre: 'rock',
  },
};

/* ── Default mood ── */
const DEFAULT_MOOD = {
  id: 'default',
  label: 'Neutral',
  emoji: '🎵',
  valence: 0.5,
  energy: 0.5,
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#a78bfa',
  glow: 'rgba(99, 102, 241, 0.35)',
  bg1: '#06060f',
  bg2: '#0f0f23',
  bg3: '#1a1a35',
  loadingText: 'Finding your perfect soundtrack...',
  genre: 'mixed',
};

export function MoodProvider({ children }) {
  const [currentMood, setCurrentMood] = useState(DEFAULT_MOOD);
  const [energyLevel, setEnergyLevel] = useState(0.5);
  const [moodHistory, setMoodHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('moodwave-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [likedTracks, setLikedTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('moodwave-liked');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [dislikedTracks, setDislikedTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('moodwave-disliked');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ── Apply mood to CSS variables ── */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mood-primary', currentMood.primary);
    root.style.setProperty('--mood-secondary', currentMood.secondary);
    root.style.setProperty('--mood-accent', currentMood.accent);
    root.style.setProperty('--mood-glow', currentMood.glow);
    root.style.setProperty('--mood-bg-1', currentMood.bg1);
    root.style.setProperty('--mood-bg-2', currentMood.bg2);
    root.style.setProperty('--mood-bg-3', currentMood.bg3);
    root.style.setProperty('--mood-speed', currentMood.energy > 0.6 ? 0.6 : 1.2);
  }, [currentMood]);

  /* ── Persist history ── */
  useEffect(() => {
    localStorage.setItem('moodwave-history', JSON.stringify(moodHistory));
  }, [moodHistory]);
  useEffect(() => {
    localStorage.setItem('moodwave-liked', JSON.stringify(likedTracks));
  }, [likedTracks]);
  useEffect(() => {
    localStorage.setItem('moodwave-disliked', JSON.stringify(dislikedTracks));
  }, [dislikedTracks]);

  const selectMood = useCallback((moodId) => {
    const preset = MOOD_PRESETS[moodId] || DEFAULT_MOOD;
    const mood = { ...preset, energy: energyLevel };
    setCurrentMood(mood);
    setMoodHistory(prev => [
      { ...mood, timestamp: Date.now() },
      ...prev.slice(0, 49),
    ]);
  }, [energyLevel]);

  const selectCustomMood = useCallback((moodObj) => {
    setCurrentMood(moodObj);
    setMoodHistory(prev => [
      { ...moodObj, timestamp: Date.now() },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const toggleLike = useCallback((trackId) => {
    setLikedTracks(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
    setDislikedTracks(prev => prev.filter(id => id !== trackId));
  }, []);

  const toggleDislike = useCallback((trackId) => {
    setDislikedTracks(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
    setLikedTracks(prev => prev.filter(id => id !== trackId));
  }, []);

  const resetMood = useCallback(() => {
    setCurrentMood(DEFAULT_MOOD);
  }, []);

  return (
    <MoodContext.Provider value={{
      currentMood,
      energyLevel,
      setEnergyLevel,
      selectMood,
      selectCustomMood,
      resetMood,
      moodHistory,
      likedTracks,
      dislikedTracks,
      toggleLike,
      toggleDislike,
      MOOD_PRESETS,
    }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used within MoodProvider');
  return context;
}
