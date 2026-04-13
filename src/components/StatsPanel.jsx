import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Heart, Clock, Zap, Music, BarChart2 } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import './StatsPanel.css';

export default function StatsPanel({ open, onClose }) {
  const { moodHistory, likedTracks, currentMood } = useMood();

  const stats = useMemo(() => {
    if (!moodHistory.length) return null;

    /* Mood frequency */
    const freq = {};
    moodHistory.forEach(m => { freq[m.id] = (freq[m.id] || 0) + 1; });
    const topMood = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];

    /* Average energy */
    const avgEnergy = moodHistory.reduce((s, m) => s + (m.energy || 0.5), 0) / moodHistory.length;

    /* Streaks — consecutive same mood */
    let maxStreak = 1, cur = 1;
    for (let i = 1; i < moodHistory.length; i++) {
      if (moodHistory[i].id === moodHistory[i - 1].id) { cur++; maxStreak = Math.max(maxStreak, cur); }
      else cur = 1;
    }

    /* Mood over last 7 entries for mini chart */
    const recentMoods = moodHistory.slice(0, 7).reverse();

    return { freq, topMood, avgEnergy, maxStreak, recentMoods, total: moodHistory.length };
  }, [moodHistory]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="stats-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="stats-panel glass-strong"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            onClick={e => e.stopPropagation()}
            aria-label="Mood Statistics"
            role="complementary"
          >
            {/* Header */}
            <div className="stats-header">
              <div className="stats-header-left">
                <BarChart2 size={18} style={{ color: 'var(--mood-primary)' }} />
                <h2 className="stats-title">Your Mood Stats</h2>
              </div>
              <button className="stats-close" onClick={onClose} aria-label="Close stats">
                <X size={18} />
              </button>
            </div>

            {!stats ? (
              <div className="stats-empty">
                <Music size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>Select a few moods to see your patterns emerge here.</p>
              </div>
            ) : (
              <div className="stats-body">
                {/* Summary cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <Clock size={16} className="stat-card-icon" />
                    <span className="stat-card-value">{stats.total}</span>
                    <span className="stat-card-label">Sessions</span>
                  </div>
                  <div className="stat-card">
                    <Heart size={16} className="stat-card-icon" style={{ color: '#ef4444' }} />
                    <span className="stat-card-value">{likedTracks.length}</span>
                    <span className="stat-card-label">Liked</span>
                  </div>
                  <div className="stat-card">
                    <Zap size={16} className="stat-card-icon" style={{ color: '#f59e0b' }} />
                    <span className="stat-card-value">{Math.round(stats.avgEnergy * 100)}%</span>
                    <span className="stat-card-label">Avg Energy</span>
                  </div>
                  <div className="stat-card">
                    <TrendingUp size={16} className="stat-card-icon" style={{ color: '#10b981' }} />
                    <span className="stat-card-value">{stats.maxStreak}×</span>
                    <span className="stat-card-label">Best Streak</span>
                  </div>
                </div>

                {/* Top mood */}
                {stats.topMood && (
                  <div className="stats-section">
                    <h3 className="stats-section-title">Favourite Mood</h3>
                    <div className="top-mood-card" style={{ borderColor: currentMood.primary + '55' }}>
                      <span className="top-mood-emoji">
                        {getMoodEmoji(stats.topMood[0])}
                      </span>
                      <div>
                        <p className="top-mood-name">{capitalize(stats.topMood[0])}</p>
                        <p className="top-mood-count">{stats.topMood[1]} times selected</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mood frequency bar chart */}
                <div className="stats-section">
                  <h3 className="stats-section-title">Mood Breakdown</h3>
                  <div className="mood-bars">
                    {Object.entries(stats.freq)
                      .sort((a, b) => b[1] - a[1])
                      .map(([moodId, count]) => (
                        <div key={moodId} className="mood-bar-row">
                          <span className="mood-bar-label">{capitalize(moodId)}</span>
                          <div className="mood-bar-track">
                            <motion.div
                              className="mood-bar-fill"
                              style={{ background: getMoodColor(moodId) }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / stats.total) * 100}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                            />
                          </div>
                          <span className="mood-bar-pct">{Math.round((count / stats.total) * 100)}%</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Mini journey */}
                <div className="stats-section">
                  <h3 className="stats-section-title">Recent Journey</h3>
                  <div className="journey-dots">
                    {stats.recentMoods.map((m, i) => (
                      <motion.div
                        key={i}
                        className="journey-dot"
                        title={capitalize(m.id)}
                        style={{ background: getMoodColor(m.id) }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <span>{m.emoji}</span>
                      </motion.div>
                    ))}
                    <div className="journey-line" />
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const MOOD_COLORS = {
  happy: '#f59e0b', energetic: '#ef4444', calm: '#3b82f6', sad: '#8b5cf6',
  romantic: '#ec4899', focused: '#10b981', nostalgic: '#d97706', angry: '#dc2626',
};

const MOOD_EMOJIS = {
  happy: '😊', energetic: '⚡', calm: '🌊', sad: '🌧️',
  romantic: '💕', focused: '🎯', nostalgic: '✨', angry: '🔥',
};

function getMoodColor(id) { return MOOD_COLORS[id] || '#6366f1'; }
function getMoodEmoji(id)  { return MOOD_EMOJIS[id] || '🎵'; }
function capitalize(s)     { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
