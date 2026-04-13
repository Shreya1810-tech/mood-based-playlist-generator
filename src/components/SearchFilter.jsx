import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, Check } from 'lucide-react';
import './SearchFilter.css';

const MOODS = ['all', 'happy', 'energetic', 'calm', 'sad', 'romantic', 'focused', 'nostalgic', 'angry'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default Order' },
  { value: 'title',   label: 'Title A–Z' },
  { value: 'artist',  label: 'Artist A–Z' },
  { value: 'duration', label: 'Duration' },
];

export default function SearchFilter({ tracks = [], onFilter, focusRef }) {
  const [query, setQuery]         = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [sortBy, setSortBy]       = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);

  /* Expose focus via ref from parent (keyboard shortcut /) */
  useEffect(() => {
    if (focusRef) focusRef.current = () => inputRef.current?.focus();
  }, [focusRef]);

  const applyFilter = useCallback((q, mood, sort) => {
    let result = [...tracks];

    /* Text filter */
    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(lower) ||
        t.artist.toLowerCase().includes(lower) ||
        t.album?.toLowerCase().includes(lower)
      );
    }

    /* Mood filter */
    if (mood !== 'all') {
      result = result.filter(t => t.mood === mood);
    }

    /* Sort */
    if (sort === 'title')    result.sort((a,b) => a.title.localeCompare(b.title));
    if (sort === 'artist')   result.sort((a,b) => a.artist.localeCompare(b.artist));
    if (sort === 'duration') result.sort((a,b) => {
      const toSec = d => { const [m,s] = d.split(':').map(Number); return m*60+s; };
      return toSec(a.duration) - toSec(b.duration);
    });

    onFilter?.(result);
  }, [tracks, onFilter]);

  useEffect(() => {
    applyFilter(query, moodFilter, sortBy);
  }, [query, moodFilter, sortBy, applyFilter]);

  const clearAll = () => {
    setQuery('');
    setMoodFilter('all');
    setSortBy('default');
  };

  const hasFilters = query || moodFilter !== 'all' || sortBy !== 'default';

  return (
    <div className="search-filter">
      {/* ── Search bar ── */}
      <div className={`search-bar glass ${query ? 'has-value' : ''}`}>
        <Search size={16} className="search-icon" />

        {/* Animated label lift */}
        <div className="search-input-wrap">
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search tracks by title, artist, or album"
            autoComplete="off"
          />
          <label
            htmlFor="search-input"
            className={`search-label ${query ? 'lifted' : ''}`}
          >
            Search tracks…
          </label>
        </div>

        {hasFilters && (
          <motion.button
            className="search-clear"
            onClick={clearAll}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.85 }}
            aria-label="Clear search and filters"
          >
            <X size={14} />
          </motion.button>
        )}

        <button
          id="filter-toggle-btn"
          className={`search-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(p => !p)}
          aria-label="Toggle filters"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={15} />
          {hasFilters && <span className="filter-dot" aria-hidden="true" />}
        </button>
      </div>

      {/* ── Filter panel ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filter-panel glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            <div className="filter-inner">
              {/* Mood chips */}
              <div className="filter-section">
                <span className="filter-label">Mood</span>
                <div className="mood-chips" role="radiogroup" aria-label="Filter by mood">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      id={`chip-${m}`}
                      className={`mood-chip ${moodFilter === m ? 'selected' : ''}`}
                      onClick={() => setMoodFilter(m)}
                      role="radio"
                      aria-checked={moodFilter === m}
                    >
                      {moodFilter === m && <Check size={11} />}
                      {m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="filter-section">
                <span className="filter-label">Sort by</span>
                <div className="sort-options">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      id={`sort-${opt.value}`}
                      className={`sort-chip ${sortBy === opt.value ? 'selected' : ''}`}
                      onClick={() => setSortBy(opt.value)}
                    >
                      {sortBy === opt.value && <Check size={11} />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
