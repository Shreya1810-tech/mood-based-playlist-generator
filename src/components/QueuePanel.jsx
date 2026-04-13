import { motion, AnimatePresence } from 'framer-motion';
import { X, ListMusic, Trash2, ChevronUp, ChevronDown, PlusCircle } from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useToast } from '../context/ToastContext';
import './QueuePanel.css';

export default function QueuePanel({ open, onClose }) {
  const { queue, removeFromQueue, clearQueue, moveUp, moveDown } = useQueue();
  const { success, info } = useToast();

  const handleClear = () => {
    clearQueue();
    info('Queue cleared');
  };

  const handleRemove = (track, index) => {
    removeFromQueue(track.id);
    success(`Removed "${track.title}" from queue`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="queue-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="queue-panel glass-strong"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            onClick={e => e.stopPropagation()}
            role="complementary"
            aria-label="Playback queue"
          >
            <div className="queue-header">
              <div className="queue-header-left">
                <ListMusic size={18} style={{ color: 'var(--mood-primary)' }} />
                <h2 className="queue-title">Queue</h2>
                <span className="queue-count">{queue.length}</span>
              </div>
              <div className="queue-header-actions">
                {queue.length > 0 && (
                  <button
                    id="clear-queue-btn"
                    className="queue-action-btn"
                    onClick={handleClear}
                    aria-label="Clear queue"
                    title="Clear all"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <button className="queue-action-btn" onClick={onClose} aria-label="Close queue">
                  <X size={16} />
                </button>
              </div>
            </div>

            {queue.length === 0 ? (
              <div className="queue-empty">
                <ListMusic size={40} style={{ opacity: 0.2, marginBottom: '0.8rem' }} />
                <p>Your queue is empty.</p>
                <p className="queue-empty-hint">Hover over a track and click <PlusCircle size={12} style={{ display: 'inline' }} /> to add it.</p>
              </div>
            ) : (
              <div className="queue-list">
                <AnimatePresence>
                  {queue.map((track, i) => (
                    <motion.div
                      key={track.id}
                      className="queue-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0 }}
                      transition={{ duration: 0.25 }}
                      layout
                    >
                      <span className="queue-pos">{i + 1}</span>
                      <span className="queue-cover">{track.cover}</span>
                      <div className="queue-info">
                        <span className="queue-track-title">{track.title}</span>
                        <span className="queue-track-artist">{track.artist}</span>
                      </div>

                      {/* Contextual actions — revealed on hover */}
                      <div className="queue-item-actions">
                        <button
                          className="qi-btn"
                          onClick={() => moveUp(i)}
                          disabled={i === 0}
                          aria-label="Move up"
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          className="qi-btn"
                          onClick={() => moveDown(i)}
                          disabled={i === queue.length - 1}
                          aria-label="Move down"
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          className="qi-btn qi-btn--remove"
                          onClick={() => handleRemove(track, i)}
                          aria-label={`Remove ${track.title}`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
