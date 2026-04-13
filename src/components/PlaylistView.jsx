import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ThumbsDown, Play, Pause, SkipForward, SkipBack,
  Share2, ArrowLeft, Clock, Maximize2, Minimize2, History,
  ListMusic, BarChart2, PlusCircle, Palette, Heart as HeartIcon, Keyboard,
} from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useQueue } from '../context/QueueContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import useHaptic from '../hooks/useHaptic';
import AudioVisualizer from './AudioVisualizer';
import SearchFilter from './SearchFilter';
import QueuePanel from './QueuePanel';
import StatsPanel from './StatsPanel';
import FavoritesScreen from './FavoritesScreen';
import ThemeSwitcher from './ThemeSwitcher';
import ShortcutsHelp from './ShortcutsHelp';
import './PlaylistView.css';
import './PlaylistViewNew.css';

export default function PlaylistView({ tracks: initialTracks, isSurprise, onBack }) {
  const { currentMood, likedTracks, dislikedTracks, toggleLike, toggleDislike, moodHistory } = useMood();
  const { addToQueue } = useQueue();
  const { success, info, error } = useToast();
  const { cycleTheme } = useTheme();
  const haptic = useHaptic();

  /* State */
  const [filteredTracks, setFilteredTracks] = useState(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAmbient, setShowAmbient] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchFocusRef = useRef(null);

  const currentTrack = filteredTracks[currentTrackIndex] || initialTracks[0];

  /* ── Player handlers ── */
  const handlePlayPause = useCallback(() => {
    setIsPlaying(p => !p);
    haptic.tap();
  }, [haptic]);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex(p => (p + 1) % filteredTracks.length);
    setIsPlaying(true);
    haptic.selection();
  }, [filteredTracks.length, haptic]);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex(p => (p - 1 + filteredTracks.length) % filteredTracks.length);
    setIsPlaying(true);
    haptic.selection();
  }, [filteredTracks.length, haptic]);

  const handleLikeCurrent = useCallback(() => {
    if (!currentTrack) return;
    toggleLike(currentTrack.id);
    haptic.success();
    const isNowLiked = !likedTracks.includes(currentTrack.id);
    success(isNowLiked ? `❤️ Liked "${currentTrack.title}"` : `Removed from favourites`);
  }, [currentTrack, toggleLike, likedTracks, haptic, success]);

  const handleAddToQueue = useCallback((track) => {
    addToQueue(track);
    haptic.tap();
    success(`"${track.title}" added to queue`);
  }, [addToQueue, haptic, success]);

  /* Share */
  const handleShare = useCallback(() => {
    const text = `🎵 My ${currentMood.label} playlist on MoodWave:\n\n${initialTracks.slice(0,5).map(t=>`${t.title} — ${t.artist}`).join('\n')}`;
    if (navigator.share) {
      navigator.share({ title: 'MoodWave Playlist', text });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        success('Playlist copied to clipboard!');
        haptic.tap();
      }).catch(() => error('Could not copy — try manually.'));
    }
  }, [currentMood, initialTracks, success, error, haptic]);

  const formatTime = (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  /* ── Keyboard shortcuts ── */
  const { showHelp: kbHelp, setShowHelp: setKbHelp, SHORTCUTS } = useKeyboardShortcuts({
    togglePlay:      handlePlayPause,
    nextTrack:       handleNext,
    prevTrack:       handlePrev,
    likeTrack:       handleLikeCurrent,
    toggleQueue:     () => setShowQueue(p => !p),
    toggleFavorites: () => setShowFavorites(p => !p),
    toggleStats:     () => setShowStats(p => !p),
    toggleAmbient:   () => setShowAmbient(p => !p),
    cycleTheme:      cycleTheme,
    focusSearch:     () => searchFocusRef.current?.(),
    escape:          () => {
      if (showQueue) setShowQueue(false);
      else if (showStats) setShowStats(false);
      else if (showFavorites) setShowFavorites(false);
      else if (showTheme) setShowTheme(false);
      else if (showAmbient) setShowAmbient(false);
    },
  });

  /* ── Ambient Mode ── */
  if (showAmbient) {
    return (
      <motion.div className="ambient-mode"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ background: `radial-gradient(ellipse at center, ${currentMood.bg2}, ${currentMood.bg1})` }}
      >
        <div className="ambient-blobs" aria-hidden="true">
          <div className="amb-blob amb-1" style={{ background: currentMood.primary + '33' }} />
          <div className="amb-blob amb-2" style={{ background: currentMood.secondary + '22' }} />
          <div className="amb-blob amb-3" style={{ background: currentMood.accent + '1a' }} />
        </div>
        <motion.div className="ambient-content"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="ambient-cover-large">
            <span>{currentTrack?.cover}</span>
          </div>
          <h2 className="ambient-title">{currentTrack?.title}</h2>
          <p className="ambient-artist">{currentTrack?.artist}</p>
          {/* Visualizer in ambient mode */}
          <div style={{ width: 260, marginTop: '0.5rem' }}>
            <AudioVisualizer isPlaying={isPlaying} barCount={20} />
          </div>
          <div className="ambient-controls">
            <button onClick={handlePrev} aria-label="Previous"><SkipBack size={24} /></button>
            <button className="ambient-play-btn" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
            </button>
            <button onClick={handleNext} aria-label="Next"><SkipForward size={24} /></button>
          </div>
        </motion.div>
        <button className="ambient-exit" onClick={() => setShowAmbient(false)} aria-label="Exit ambient mode">
          <Minimize2 size={18} /> Exit Ambient
        </button>
      </motion.div>
    );
  }

  /* ── Main Playlist View ── */
  return (
    <motion.div className="playlist-view"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── Top Bar ── */}
      <div className="playlist-topbar">
        <motion.button id="back-btn" className="back-btn" onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label="Go back">
          <ArrowLeft size={20} />
        </motion.button>
        <div className="topbar-actions">
          <button id="history-btn"   className="icon-btn" onClick={() => setShowHistory(p => !p)} aria-label="Mood history" title="Mood history"><Clock size={16} /></button>
          <button id="stats-btn"     className="icon-btn" onClick={() => setShowStats(true)}    aria-label="Stats"         title="Stats (S)"><BarChart2 size={16} /></button>
          <button id="favs-btn"      className="icon-btn" onClick={() => setShowFavorites(true)} aria-label="Favourites"   title="Favourites (F)"><HeartIcon size={16} /></button>
          <button id="queue-btn"     className="icon-btn" onClick={() => setShowQueue(true)}     aria-label="Queue"        title="Queue (Q)"><ListMusic size={16} /></button>
          <button id="ambient-btn"   className="icon-btn" onClick={() => setShowAmbient(true)}   aria-label="Ambient mode" title="Ambient (A)"><Maximize2 size={16} /></button>
          <button id="theme-btn"     className="icon-btn" onClick={() => setShowTheme(p => !p)}  aria-label="Theme"        title="Theme (T)"><Palette size={16} /></button>
          <button id="share-btn"     className="icon-btn" onClick={handleShare}                  aria-label="Share"        title="Share"><Share2 size={16} /></button>
          <button id="keyboard-btn"  className="icon-btn" onClick={() => setKbHelp(p => !p)}     aria-label="Shortcuts"    title="Shortcuts (?)"><Keyboard size={16} /></button>
        </div>
      </div>

      {/* ── Mood History Panel ── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div className="history-panel glass"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}
          >
            <h3 className="history-title"><Clock size={15} /> Mood Journey</h3>
            {moodHistory.length === 0 ? (
              <p className="history-empty">No mood history yet.</p>
            ) : (
              <div className="history-timeline">
                {moodHistory.slice(0, 8).map((entry, i) => (
                  <div key={i} className="history-item">
                    <span className="history-emoji">{entry.emoji}</span>
                    <div className="history-info">
                      <span className="history-label">{entry.label}</span>
                      <span className="history-time">{formatTime(entry.timestamp)}</span>
                    </div>
                    <div className="history-color-dot" style={{ background: entry.primary }} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Now Playing ── */}
      <motion.div className="now-playing glass-strong"
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
      >
        <div className="np-left">
          <motion.div className="np-cover"
            style={{ background: `linear-gradient(135deg, ${currentMood.primary}33, ${currentMood.secondary}22)`, boxShadow: `0 0 30px ${currentMood.glow}` }}
            animate={isPlaying ? { rotate: [0, 360] } : {}}
            transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
          >
            <span className="np-emoji">{currentTrack?.cover}</span>
          </motion.div>
          <div className="np-info">
            <h3 className="np-title">{currentTrack?.title}</h3>
            <p className="np-artist">{currentTrack?.artist}</p>
          </div>
        </div>
        <div className="np-right">
          {/* Audio Visualizer */}
          <div className="np-visualizer">
            <AudioVisualizer isPlaying={isPlaying} barCount={24} />
          </div>
          <div className="np-controls">
            <button onClick={handlePrev} className="np-btn" aria-label="Previous"><SkipBack size={18} /></button>
            <motion.button onClick={handlePlayPause} className="np-play-btn"
              style={{ background: `linear-gradient(135deg, ${currentMood.primary}, ${currentMood.secondary})` }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="white" />}
            </motion.button>
            <button onClick={handleNext} className="np-btn" aria-label="Next"><SkipForward size={18} /></button>
          </div>
        </div>
      </motion.div>

      {/* ── Search & Filter ── */}
      <SearchFilter tracks={initialTracks} onFilter={setFilteredTracks} focusRef={searchFocusRef} />

      {/* ── Playlist Header ── */}
      <div className="playlist-header">
        <div className="playlist-mood-badge" style={{ background: currentMood.primary + '22', borderColor: currentMood.primary + '55' }}>
          <span>{currentMood.emoji}</span>
          <span>{isSurprise ? 'Surprise Mix' : `${currentMood.label} Playlist`}</span>
        </div>
        <p className="playlist-count">{filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''}</p>
      </div>

      {/* ── Track List ── */}
      <div className="track-list" role="list">
        {filteredTracks.length === 0 && (
          <div className="no-results">No tracks match your search.</div>
        )}
        {filteredTracks.map((track, i) => {
          const isLiked    = likedTracks.includes(track.id);
          const isDisliked = dislikedTracks.includes(track.id);
          const isCurrent  = i === currentTrackIndex;

          return (
            <motion.div key={track.id}
              className={`track-card ${isCurrent ? 'current' : ''} ${isDisliked ? 'disliked' : ''}`}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); haptic.selection(); }}
              role="listitem" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentTrackIndex(i); setIsPlaying(true); } }}
              aria-label={`${track.title} by ${track.artist}${isCurrent ? ', currently playing' : ''}`}
            >
              <span className="track-index">
                {isCurrent && isPlaying ? (
                  <span className="playing-indicator" aria-label="Playing"><span /><span /><span /></span>
                ) : track.index}
              </span>
              <div className="track-cover-small"><span>{track.cover}</span></div>
              <div className="track-info">
                <span className="track-title">{track.title}</span>
                <span className="track-artist">{track.artist}</span>
              </div>
              <span className="track-duration">{track.duration}</span>

              {/* Contextual actions — revealed on hover */}
              <div className="track-actions">
                <button
                  className={`track-action-btn ${isLiked ? 'liked' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleLike(track.id); haptic.tap(); success(likedTracks.includes(track.id) ? 'Removed from favourites' : `❤️ Liked!`); }}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                <button
                  className="track-action-btn track-action-btn--queue"
                  onClick={e => { e.stopPropagation(); handleAddToQueue(track); }}
                  aria-label="Add to queue"
                  title="Add to queue"
                >
                  <PlusCircle size={13} />
                </button>
                <button
                  className={`track-action-btn ${isDisliked ? 'disliked-btn' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleDislike(track.id); haptic.tap(); }}
                  aria-label={isDisliked ? 'Remove dislike' : 'Dislike'}
                  title="Dislike"
                >
                  <ThumbsDown size={13} fill={isDisliked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Panels & Overlays ── */}
      <QueuePanel       open={showQueue}     onClose={() => setShowQueue(false)} />
      <StatsPanel       open={showStats}     onClose={() => setShowStats(false)} />
      <FavoritesScreen  open={showFavorites} onClose={() => setShowFavorites(false)} allTracks={initialTracks} />
      <ThemeSwitcher    open={showTheme}     onClose={() => setShowTheme(false)} />
      <ShortcutsHelp    open={kbHelp}        onClose={() => setKbHelp(false)} shortcuts={SHORTCUTS} />
    </motion.div>
  );
}
